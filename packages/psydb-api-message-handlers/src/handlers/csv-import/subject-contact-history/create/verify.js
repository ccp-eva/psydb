'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');

var {
    verifyOneRecord,
    verifyOneCRT,
} = require('@mpieva/psydb-api-message-handler-lib');

var {
    SubjectContactHistoryCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,

    verifyFileRecord,
    verifyFileMimeType,
    
    verifySubjectCRT,
    tryPrepareImport,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    await next();
}

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

var verifySubjectCRT = verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
    byStudyId: '/payload/studyId',
    cache: true
});

var tryPrepareImport = async (context, next) => {
    var { db, message, cache } = context;
    var { timezone } = message;
    var { subjectCRT, study, file } = cache.get();

    try {
        var pipelineOutput = await (
            SubjectContactHistoryCSV.runPipeline({
                db, csvLines: file.blob.toString(),
                subjectType: subjectCRT.getType(), timezone,
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

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
