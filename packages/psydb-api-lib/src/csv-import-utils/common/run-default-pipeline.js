'use strict';
var parseSchemaCSV = require('./parse-schema-csv');
var injectRefIds = require('./inject-ref-ids');

// NOTE: not happy with theese
var __filterValidObjects = require('./__filter-valid-objects');
var __mergedInjectionData = require('./__merge-injection-data');

var runDefaultPipeline = async (bag) => {
    var {
        db,
        csvData,
        // FIXME: not sure about preparsed; maybe split csv-parsing
        // from default pipeline entirely?
        parsed = undefined,
        schema,
        customColumnRemap,
        unmarshalClientTimezone,
        extraRecordResolvePointers,
    } = bag;

    if (!parsed) {
        parsed = parseSchemaCSV({
            csvData, schema, customColumnRemap,
            unmarshalClientTimezone
        });
    }

    // NOTE: im not happy with this
    var validObjects = __filterValidObjects({ parsed });

    var injectionData = await injectRefIds({ 
        db, schema, into: validObjects,
        extraRecordResolvePointers,
    });

    // NOTE: im not happy with this
    var preparedObjects = [];
    __mergedInjectionData({
        parsed, injectionData, pushTarget: preparedObjects
    });

    return { pipelineData: parsed, preparedObjects };
}

module.exports = runDefaultPipeline;
