'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:subjectTypeDataForStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var subjectTypeDataForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        studyId,
    } = params;

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

    var { selectionSettingsBySubjectType } = studyRecord.state;
    
    var subjectTypeRecords = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                type: { $in: selectionSettingsBySubjectType.map(it => (
                    it.subjectRecordType
                ))}
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    context.body = ResponseBody({
        data: {
            records: subjectTypeRecords,
        },
    });

    await next();
};

module.exports = subjectTypeDataForStudy;
