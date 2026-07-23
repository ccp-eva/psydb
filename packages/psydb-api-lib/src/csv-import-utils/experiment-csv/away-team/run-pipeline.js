'use strict';
var { CSVColumnRemappers } = require('@mpieva/psydb-common-lib');
var { runDefaultPipeline } = require('../../common');

var CSVSchema = require('./csv-schema');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
  
        locationCRT,
        subjectCRT,
        study,
        timezone: unmarshalClientTimezone
    } = bag;

    var schema = CSVSchema({ subjectCRT, locationCRT });
    var customColumnRemap = (
        CSVColumnRemappers.Experiment.AwayTeam().csv2obj
    );

    var { importSettings = {}} = subjectCRT.getRaw();
    var { extraIdFields = [] } = importSettings;

    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        extraRecordResolvePointers: {
            subject: [ '/onlineId', ...extraIdFields.map(it => it.pointer) ],
            //location: [ '/state/custom/name' ],
        },
    });

    var okPipelineData = (
        pipelineData.filter(it => it.isValid && it.isRefReplacementOk)
    );

    var transformed = transformPrepared({
        pipelineData: okPipelineData,

        subjectCRT,
        study,
        timezone: unmarshalClientTimezone
    });

    return {
        pipelineData,
        transformed
    }
}

module.exports = runPipeline;
