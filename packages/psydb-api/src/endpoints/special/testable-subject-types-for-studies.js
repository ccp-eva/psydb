'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:testableSubjectTypesForStudies'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
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
        StripEventsStage(),
    ]).toArray()
    
    var subjectRecordTypes = [];
    for (var study of studyRecords) {
        var { subjectTypeSettings } = study.state;
        for (var item of subjectTypeSettings) {
            subjectRecordTypes.push(item.customRecordType);
        } 
    }
    
    context.body = ResponseBody({
        data: {
            subjectRecordTypes
        }
    });

    await next();
}

module.exports = testableSubjectTypesForStudies;
