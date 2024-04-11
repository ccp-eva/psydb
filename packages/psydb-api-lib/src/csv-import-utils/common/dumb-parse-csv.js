'use strict';
var { CsvError, parse: parseCSV } = require('csv-parse/sync');

var dumbParseCSV = (data) => {
    var csvColumns, csvLines;
    try {
        ([ csvColumns, ...csvLines ] = parseCSV(data));
    }
    catch (e) {
        if (e instanceof CsvError) {
            throw e; // TODO wrap error
        }
        else {
            throw e;
        }
    }

    return { csvColumns, csvLines }
}

module.exports = dumbParseCSV;
