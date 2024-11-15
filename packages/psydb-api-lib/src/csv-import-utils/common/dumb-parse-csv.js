'use strict';
var { CsvError, parse: parseCSV } = require('csv-parse/sync');
// NOTE: clean-deep has 3 lodash deps
var { clean } = require('fast-clean');

var { unflatten } = require('@mpieva/psydb-core-utils');
var { CSVImportError } = require('../errors');

var dumbParseCSV = (data, { customColumnRemap } = {}) => {
    var csvColumns, csvLines;
    try {
        // XXX: i think csvLines is used in ui for error message
        // so we just parse this twice for now
        var [ csvColumns, ...csvLines ] = parseCSV(data);

        var parsed = parseCSV(data, {
            columns: true,
            cast: (value) => {
                if (['TRUE','FALSE', 'true', 'false'].includes(value)) {
                    return (value.toLowerCase() === 'true')
                }
                // NOTE: this is such horseshit
                else if (String(Number(value)) === value) {
                    return Number(value);
                }
                else {
                    return value;
                }
            }
        });

        var out = [];
        for (var obj of parsed) {
            var precleaned = clean(obj, {
                emptyArraysCleaner: false
            });
            var remapped = {};
            for (var [key, value] of Object.entries(precleaned)) {
                if (customColumnRemap) {
                    key = customColumnRemap({ colkey: key }) || key;
                }
                key = key.replace(
                    /\[(\d+)\]/g, (match, g1) => `.${g1}`
                ); // XXX
                remapped[key] = value;
            }
            var unflattened = unflatten(remapped, {
                initArrayOnNumericToken: true
            });
            var postcleaned = clean(unflattened, {
                emptyArraysCleaner: false
            });

            out.push(postcleaned);
        }
    }
    catch (e) {
        if (e instanceof CsvError) {
            throw new CSVImportError(e.message)
        }
        else {
            throw e;
        }
    }

    //console.dir(out, { depth: null });
    return { csvLines, parsed: out };
}

module.exports = dumbParseCSV;
