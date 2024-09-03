'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { CSVColumnRemappers } = require('@mpieva/psydb-common-lib');
var { runDefaultPipeline } = require('../common');

var CSVSchema = require('./csv-schema');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
        subjectCRT,
        researchGroup,
        timezone: unmarshalClientTimezone
    } = bag;

    var schema = CSVSchema({ subjectCRT });
    var customColumnRemap = (
        CSVColumnRemappers.SubjectDefault({ subjectCRT }).csv2obj
    );

    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone
    });

    var transformed = transformPrepared({
        preparedObjects,

        subjectCRT,
        researchGroup,
        timezone: unmarshalClientTimezone,
    });

    return {
        pipelineData,
        transformed
    }
}

module.exports = runPipeline;
