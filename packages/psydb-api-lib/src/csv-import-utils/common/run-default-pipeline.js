'use strict';
var parseSchemaCSV = require('./parse-schema-csv');
var injectRefIds = require('./inject-ref-ids');

var runDefaultPipeline = async (bag) => {
    var {
        db,
        csvData,
        schema,
        customColumnRemap,
        unmarshalClientTimezone
    } = bag;

    var parsed = parseSchemaCSV({
        csvData, schema, customColumnRemap,
        unmarshalClientTimezone
    });

    // NOTE: im not happy with this block
    var validObjects = []
    for (var it of parsed) {
        var { obj, isValid } = it;
        if (isValid) {
            validObjects.push(obj);
        }
    }

    var injectionData = await injectRefIds({ 
        db, schema, into: validObjects,
        extraRecordResolvePointers: { subject: [
            '/scientific/state/custom/wkprcIdCode'
        ]},
    });

    // NOTE: im not happy with this block
    var preparedObjects = [];
    for (var it of parsed) {
        if (it.isValid) {
            var { obj, isOk, replacements, errors } = injectionData.shift();
            if (isOk) {
                it.isRefReplacementOk = true;
                it.replacements = replacements;
                preparedObjects.push(obj)
            }
            else {
                it.isRefReplacementOk = false;
                it.replacements = replacements;
                it.replacementErrors = errors;
            }
        }
    }

    return { pipelineData: parsed, preparedObjects };
}

module.exports = runDefaultPipeline;
