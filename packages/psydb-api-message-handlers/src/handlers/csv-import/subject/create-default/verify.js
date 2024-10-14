'use strict';
var { ejson, without } = require('@mpieva/psydb-core-utils');
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    compose,
    switchComposition,
    
    ApiError,
    FakeAjvError,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var {
    verifyOneRecord,
    verifyOneCRT,
} = require('@mpieva/psydb-api-message-handler-lib');

var {
    SubjectDefaultCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    
    verifySubjectCRT,
    verifyResearchGroupRecord,

    //verifyAccessRights,
    verifyFileRecord,
    verifyFileMimeType,

    tryPrepareImport,
    //verifyNoDuplicates // TODO
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    //if (!permissions.hasFlag('canImportSubjects')) {
    //    throw new ApiError(403);
    //}

    await next();
}

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
    var { timezone, payload: { labOperatorIds }} = message;
    var { subjectCRT, researchGroup, file } = cache.get();

    try {
        var pipelineOutput = await SubjectDefaultCSV.runPipeline({
            db,
            csvLines: file.blob.toString(),

            subjectCRT,
            researchGroup,
            timezone,
        });
    }
    catch (e) {
        if (e instanceof CSVImportError) {
            // TODO
            console.log(e);
            console.log(e.getInfo());
            throw new ApiError(409, 'cannot parse csv contents');
        }
        else {
            throw e
        }
    }

    var { transformed, pipelineData } = pipelineOutput;
    var { subjects } = transformed;

    if (subjects.length < 1) {
        throw new ApiError(409, {
            apiStatus: 'NoSubjectsAreImportable',
            data: pipelineData
        })
    }

    cache.merge({ pipelineOutput });
    await next();
}

var verifySubjectCRT = verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
    cache: true
});

var verifyResearchGroupRecord = verifyOneRecord({
    collection: 'researchGroup',
    by: '/payload/researchGroupId',
    cache: true
});

var verifyFileRecord = verifyOneRecord({
    collection: 'file',
    by: '/payload/fileId',
    cache: true,
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
