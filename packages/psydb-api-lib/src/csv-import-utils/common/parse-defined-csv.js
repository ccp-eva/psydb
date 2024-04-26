'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var { FieldDefinition, sift } = require('@mpieva/psydb-common-lib');

var {
    CSVImportError,
    UnknownCSVColumnKeys,
    MissingCSVColumnKeys,
    MissingCSVColumnValues
} = require('../errors');

var dumbParseCSV = require('./dumb-parse-csv');
var commonDeserializers = require('./deserializers');

var parseDefinedCSV = (bag) => {
    var {
        csvData,
        definitions,
        required = [],
        deserializers = commonDeserializers,
        throwUnknown = true
    } = bag;

    var { csvColumns, csvLines } = dumbParseCSV(csvData);

    var missingRequiredColumnKeys = without({
        that: required,
        without: csvColumns
    });

    if (missingRequiredColumnKeys.length > 0) {
        throw new MissingCSVColumnKeys(missingRequiredColumnKeys);
    }
    
    var mapping = createCSVColumnMapping({
        definitions, csvColumns, throwUnknown,
    });

    var out = [];
    for (var [ lineIX, linedata ] of csvLines.entries()) {
        var missingCSVColumnKeys = [ ...required ];
        var parsedline = [];
        for (var entry of linedata.entries()) {
            var [ columnIX, value ] = entry;
            var m = mapping[columnIX];
            
            // FIXME: naming of 'mapping' is off since we have unmapped
            var { isUnmapped } = m;
            if (isUnmapped) {
                continue;
            }
            
            var { csvColumnKey, definition, realKey, extraPath  } = m;
            var { systemType } = definition;
            
            if (String(value).trim() !== '') {
                missingCSVColumnKeys = missingCSVColumnKeys.filter((c) => (
                    c !== csvColumnKey
                ));
            }

            
            if (isUnsupportedType(systemType)) {
                // FIXME
                throw new Error('unsupported field type');
            }
            var deserialize = (
                deserializers[systemType] || (({ value }) => (value))
            );
            parsedline.push({
                definition, realKey, extraPath,
                value: deserialize({
                    value: String(value).trim(),
                    definition
                })
            });
        }

        if (missingCSVColumnKeys.length > 0) {
            throw new MissingCSVColumnValues({
                keys: missingCSVColumnKeys,
                line: lineIX + 1
            });
        }
        out.push(parsedline);
    }

    return out;
}

var createCSVColumnMapping = (bag) => {
    var { definitions, csvColumns, throwUnknown = true } = bag;

    var available = [];
    for (var it of definitions) {
        var def = FieldDefinition({ data: it });
        var keys = def.getCSVColumnKeys();
        if (keys) {
            available.push(...keys);
        }
    }
    
    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of csvColumns.entries()) {
        var [ ix, csvColumnKey ] = entry;

        var tokens = csvColumnKey.split(/\./);
        var [ realKey, ...extraPath ] = tokens;

        var sharedInfoBag = {
            csvColumnKey,
            realKey,
            extraPath
        };

        if (!available.includes(csvColumnKey)) {
            infos.push({ ...sharedInfoBag, isUnmapped: true });
            unknownCSVColumnKeys.push(csvColumnKey);
            continue;
        }

        var found = definitions.filter(sift({
            $or: [
                { csvColumnKey },
                { csvColumnKey: { $exists: false }, key: realKey }
            ]
        }));

        if (found.length === 1) {
            infos.push({ ...sharedInfoBag, definition: found[0] });
        }
        else if (found.length > 1) {
            throw new CSVImportError(
                `multiple fields match column key "${csvColumnKey}"`
            );
        }
        else {
            throw new CSVImportError(
                `unexpected error for column key "${csvColumnKey}"`
            );
        }
    }
    
    if (throwUnknown && unknownCSVColumnKeys.length > 0) {
        throw new UnknownCSVColumnKeys(unknownCSVColumnKeys);
    }

    return infos;
}

var isUnsupportedType = (systemType) => {
    return [
        'ListOfObjects',
    ].includes(systemType)
}

module.exports = parseDefinedCSV;
