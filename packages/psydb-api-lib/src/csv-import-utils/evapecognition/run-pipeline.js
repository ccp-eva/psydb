'use strict';
var { CSVColumnRemappers } = require('@mpieva/psydb-common-lib');
var { runDefaultPipeline } = require('../common');

var CSVSchema = require('./csv-schema');
var verifySameSubjectType = require('./verify-same-subject-type');
var verifySameSubjectGroup = require('./verify-same-subject-group');
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
        CSVColumnRemappers.Experiment.WKPRCApestudiesDefault().csv2obj
    );

    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        extraRecordResolvePointers: {
            subject: [ '/scientific/state/custom/wkprcIdCode'],
            location: [ '/state/custom/name' ],
        },
    });

    var okPipelineData = (
        pipelineData.filter(it => it.isValid && it.isRefReplacementOk)
    );

    await verifySameSubjectType({ db, subjectType, preparedObjects });
    await verifySameSubjectGroup({ db, preparedObjects });

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
