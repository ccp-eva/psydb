'use strict';
var { runDefaultPipeline } = require('../../common');

var CSVSchema = require('./csv-schema');
var customColumnRemap = require('./custom-column-remap');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
  
        locationType,
        subjectType,
        study,
        timezone: unmarshalClientTimezone
    } = bag;

    var schema = CSVSchema({ locationType });
    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        extraRecordResolvePointers: {
            subject: [ '/onlineId'],
            //location: [ '/state/custom/name' ],
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
