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

    var { importSettings = {}} = subjectCRT.getRaw();
    var { extraIdFields = [] } = importSettings;

    var { pipelineData, preparedObjects } = await runDefaultPipeline({
        db, csvData, schema, customColumnRemap, unmarshalClientTimezone,
        // TODO: actually we need to adde extra id pointers for all the
        // existing crts here
        ...(extraIdFields.length > 0 && {
            extraRecordResolvePointers: {
                subject: extraIdFields.map(it => it.pointer)
            }
        })
        //extraRecordResolvePointers: {
        //    location: [ '/sequenceNumber' ],
        //    personnel: [ '/sequenceNumber' ]
        //}
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
