'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:testableSubjectTypesForStudies'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    SystemPermissionStages,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var testableSubjectTypesForStudies = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        studyIds,
    } = request.body;

    // TODO: check body + unmarshal

    var studyRecords = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        ...SystemPermissionStages({ permissions }),
        StripEventsStage(),
    ]).toArray()

    var subjectRecordTypes = [];
    for (var study of studyRecords) {
        var { selectionSettingsBySubjectType } = study.state;
        for (var item of selectionSettingsBySubjectType) {
            subjectRecordTypes.push(item.subjectRecordType);
        } 
    }

    var subjectRecordTypeRecords = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                collection: 'subject',
                type: { $in: subjectRecordTypes }
            }},
            { $project: {
                collection: true,
                type: true,
                'state.label': true,
            }}
        ]).toArray()
    );
    
    context.body = ResponseBody({
        data: {
            subjectRecordTypeRecords,
        }
    });

    await next();
}

module.exports = testableSubjectTypesForStudies;
