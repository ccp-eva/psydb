'use strict';
var { runDefaultPipeline } = require('../common');

var CSVSchema = require('./csv-schema');
var customColumnRemap = require('./custom-column-remap');

var verifySameSubjectType = require('./verify-same-subject-type');
var verifySameSubjectGroup = require('./verify-same-subject-group');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
   
        subjectType,
        study,
        location,
        labOperators,
        timezone: unmarshalClientTimezone
    } = bag;

    var schema = CSVSchema();
    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone
    });

    await verifySameSubjectType({ db, subjectType, preparedObjects });
    await verifySameSubjectGroup({ db, preparedObjects });

    var transformed = transformPrepared({
        preparedObjects,

        subjectType,
        study,
        location,
        labOperators,
        timezone: unmarshalClientTimezone
    });

    return {
        pipelineData,
        transformed
    }
}

module.exports = runPipeline;
