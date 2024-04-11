'use strict';
var { sift } = require('@mpieva/psydb-common-lib');
var { UnknownCSVColumnKeys } = require('../errors');
var dumbParseCSV = require('./dumb-parse-csv');
var commonDeserializers = require('./deserializers');

var parseDefinedCSV = (bag) => {
    var {
        csvData,
        definitions,
        deserializers = commonDeserializers,
        throwUnknown = true
    } = bag;

    var { csvColumns, csvLines } = dumbParseCSV(csvData);
    
    var mapping = createCSVColumnMapping({
        definitions, csvColumns, throwUnknown,
    });

    var out = [];
    for (var linedata of csvLines) {
        var parsedline = [];
        for (var entry of linedata.entries()) {
            var [ ix, value ] = entry;
            var m = mapping[ix];

            // FIXME: naming of 'mapping' is off since we have unmapped
            var { isUnmapped } = m;
            if (isUnmapped) {
                continue;
            }
            
            var { definition, realKey, extraPath  } = m;
            var { systemType } = definition;
            
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
        out.push(parsedline);
    }

    return out;
}

var createCSVColumnMapping = (bag) => {
    var { definitions, csvColumns, throwUnknown = true } = bag;
    
    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of csvColumns.entries()) {
        var [ ix, csvColumnKey ] = entry;
        
        var tokens = csvColumnKey.split(/\./);
        var [ realKey, ...extraPath ] = tokens;

        var found = definitions.filter(sift({
            $or: [
                { csvColumnKey },
                { csvColumnKey: { $exists: false }, key: realKey }
            ]
        }));

        if (found > 1) {
            throw new Error(
                `multiple fields match column key "${csvColumnKey}"`
            );
        }
        else if (found < 1) {
            infos.push({ realKey, extraPath, isUnmapped: true })
            unknownCSVColumnKeys.push(csvColumnKey);
        }
        else {
            infos.push({ definition: found[0], realKey, extraPath });
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
