'use strict';
var { keyBy, compareIds } = require('@mpieva/psydb-core-utils');
var {
    ApiError,
    compose,
    withRetracedErrors,
    aggregateToArray,
} = require('@mpieva/psydb-api-lib');

var {
    verifyOneRecord,
    verifyOneCRT,
} = require('@mpieva/psydb-api-message-handler-lib');

var {
    ExperimentCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,

    verifyStudyRecord,
    verifyFileRecord,
    verifyFileMimeType,
    
    verifySubjectCRT,
    verifyLocationCRT,
    tryPrepareImport,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    await next();
}

var verifyStudyRecord = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true
});

var verifyFileRecord = verifyOneRecord({
    collection: 'file',
    by: '/payload/fileId',
    cache: true,
});

var verifyFileMimeType = async (context, next) => {
    var { cache } = context;
    var { file } = cache.get();
    
    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }
    
    await next();
}

var tryPrepareImport = async (context, next) => {
    var { db, message, cache } = context;
    var { timezone } = message;
    var { locationCRT, subjectCRT, study, file } = cache.get();

    try {
        var pipelineOutput = await (
            ExperimentCSV.ManualOnlyParticipation.runPipeline({
                db,
                csvLines: file.blob.toString(),

                locationType: locationCRT.getType(),
                subjectType: subjectCRT.getType(),
                study,
                timezone,
            })
        );

        cache.merge({ pipelineOutput });
    }
    catch (e) {
        if (e instanceof CSVImportError) {
            // TODO
            throw new ApiError(409, 'cannot parse csv contents');
        }
        else {
            throw e
        }
    }

    await next();
}

var verifySubjectCRT = verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
    byStudyId: '/payload/studyId',
    cache: true
});

var verifyLocationCRT = verifyOneCRT({
    collection: 'location',
    by: '/payload/locationType',
    byStudyId: '/payload/studyId',
    cache: true
});

//var verifySubjectType = async (context, next) => {
//    var { db, message, cache } = context;
//    var { studyId, subjectType } = message.payload;
//    
//    var subjectCRTs = await fetchAvailableCRTSettings({
//        db, collections: [ 'subject' ], byStudyId,
//        wrap: false, asTree: false
//    });
//    // FIXME: move that into above when asTree is false
//    var subjectCRT = CRTSettingsList({ items: subjectCRTs }).find({
//        'type': subjectType
//    });
//
//    if (!subjectCRT) {
//        throw new ApiError(400, 'InvalidSubjectType');
//    }
//
//    cache.merge({ subjectCRT });
//    await next();
//}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
