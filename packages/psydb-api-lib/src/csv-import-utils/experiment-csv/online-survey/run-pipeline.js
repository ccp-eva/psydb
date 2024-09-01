'use strict';
var { runDefaultPipeline } = require('../../common');

var CSVSchema = require('./csv-schema');
var customColumnRemap = require('./custom-column-remap');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
  
        subjectType,
        study,
        timezone: unmarshalClientTimezone
    } = bag;

    var schema = CSVSchema();
    var { pipelineData } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        extraRecordResolvePointers: {
            subject: [ '/onlineId' ],
        },
    });

    var okPipelineData = (
        pipelineData.filter(it => it.isValid && it.isRefReplacementOk)
    );

    var transformed = transformPrepared({
        pipelineData: okPipelineData,

        subjectType,
        study,
        timezone: unmarshalClientTimezone
    });

    return {
        pipelineData,
        transformed
    }
}

module.exports = runPipeline;
