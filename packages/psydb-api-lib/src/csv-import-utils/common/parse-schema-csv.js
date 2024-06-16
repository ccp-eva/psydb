'use strict';
var Ajv = require('../../ajv');

var dumbParseCSV = require('./dumb-parse-csv');
var dumbMakeObjects = require('./dumb-make-objects');

var parseSchemaCSV = (bag) => {
    var {
        csvData,
        schema,
        unmarshalClientTimezone
        //deserializers = commonDeserializers,
    } = bag;

    var { csvColumns, csvLines } = dumbParseCSV(csvData);
    var parsed = dumbMakeObjects({ csvColumns, csvLines });

    var ajv = Ajv({ coerceTypes: true, unmarshalClientTimezone });
    var validation = [];

    for (var [ix, it] of parsed.entries()) {
        var isValid = ajv.validate(schema, it);
        validation.push(
            isValid
            ? ({ isValid })
            : ({ isValid, errors: ajv.errors })
        );
    }

    var out = [];
    for (var [ix, it] of csvLines.entries()) {
        out.push({ csvLine: it, parsed: parsed[ix], ...validation[ix] });
    }
    return out;
}

module.exports = parseSchemaCSV;
