'use strict';
var Ajv = require('../../ajv');

var dumbParseCSV = require('./dumb-parse-csv');
var dumbMakeObjects = require('./dumb-make-objects');

var parseSchemaCSV = (bag) => {
    var {
        csvData,
        schema,
        unmarshalClientTimezone,
        customColumnRemap,
        //deserializers = commonDeserializers,
    } = bag;

    var { csvColumns, csvLines } = dumbParseCSV(csvData);

    var parsed = dumbMakeObjects({
        csvColumns: maybeRemapColumns({ csvColumns, customColumnRemap }),
        csvLines
    });

    var ajv = Ajv({
        coerceTypes: true,
        unmarshalClientTimezone,
        formatOverrides: {
            // NOTE: to enable smart ref resolve
            mongodbObjectId: { validate: /.*/ },
        }
    });
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
        out.push({ csvLine: it, obj: parsed[ix], ...validation[ix] });
    }
    return out;
}

var maybeRemapColumns = (bag) => {
    var { csvColumns, customColumnRemap } = bag;

    if (customColumnRemap) {
        var remappedColumns = [];
        for (var it of csvColumns) {
            remappedColumns.push(customColumnRemap(it) || it);
        }
        return remappedColumns;
    }
    else {
        return csvColumns;
    }
}

module.exports = parseSchemaCSV;
