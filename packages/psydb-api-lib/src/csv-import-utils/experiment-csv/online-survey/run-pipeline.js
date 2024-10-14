'use strict';
var { CSVColumnRemappers } = require('@mpieva/psydb-common-lib');
var { runDefaultPipeline } = require('../../common');

var CSVSchema = require('./csv-schema');
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
    var customColumnRemap = (
        CSVColumnRemappers.Experiment.OnlineSurvey().csv2obj
    );

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
