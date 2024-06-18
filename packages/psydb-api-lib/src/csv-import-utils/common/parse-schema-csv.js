'use strict';
var dumbParseCSV = require('./dumb-parse-csv');
var dumbMakeObjects = require('./dumb-make-objects');
var validateMany = require('./validate-many');

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

    var validation = validateMany({ schema, items: parsed, ajvOptions: {
        coerceTypes: true,
        unmarshalClientTimezone,
        formatOverrides: {
            // NOTE: to enable smart ref resolve
            mongodbObjectId: { validate: /.*/ },
        }
    }});

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
