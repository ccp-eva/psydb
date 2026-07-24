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
        timezone: unmarshalClientTimezone,

        groupingFN = undefined,
    } = bag;

    var schema = CSVSchema({ subjectCRT, locationCRT });
    var customColumnRemap = (
        CSVColumnRemappers.Experiment.Inhouse().csv2obj
    );

    var extraIdFields = {
        subject: subjectCRT.getExtraImportIds({ as: 'pointers' }),
        location: locationCRT.getExtraImportIds({ as: 'pointers' }),
    }

    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        extraRecordResolvePointers: {
            subject: [ '/onlineId', ...extraIdFields.subject ],
            location: [ ...extraIdFields.location ],
            personnel: [ '/scientific/state/manualImportId' ],
        },
    });

    var okPipelineData = (
        pipelineData.filter(it => it.isValid && it.isRefReplacementOk)
    );

    var transformed = transformPrepared({
        pipelineData: okPipelineData,
        groupingFN,

        subjectCRT,
        study,
        timezone: unmarshalClientTimezone,
    });

    return {
        pipelineData,
        transformed
    }
}

module.exports = runPipeline;
