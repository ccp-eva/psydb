'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentOperatorTeamsForStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var experimentOperatorTeamsForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        studyId,
    } = params;

    // TODO: check params

    var studyRecord = await fetchRecordById({
        db,
        collectionName: 'study',
        id: studyId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!studyRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId,
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    /*locationRecords.forEach(it => {
        it._recordLabel = createRecordLabel({
            record: it,
            definition: customRecordTypeRecord.state.recordLabelDefinition
        })
    })*/

    context.body = ResponseBody({
        data: {
            records: experimentOperatorTeamRecords,
        },
    });

    await next();
};

module.exports = experimentOperatorTeamsForStudy;
