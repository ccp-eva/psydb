'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');
var {
    verifyOneRecord
    verifyRecordType,
} = require('@mpieva/psydb-api-message-handler-lib');

var {
    EVApeCognitionCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,

    verifyStudyRecord,
    verifyLocationRecord,
    verifyLabOperatorRecords,

    verifyFileRecord,
    verifyFileMimeType,
    
    verifySubjectType,
    tryPrepareImport,

    verifySameSubjectGroup, // TODO
]);

var verifyPermissions = async (context) => {
    var { db, permissions, message } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
}

var verifyLocation = verifyOneRecord({
    collection: 'location',
    by: '/payload/locationId',
    cache: true
});

var verifyStudy = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true
});

var verifyFileRecord = verifyOneRecord({
    collection: 'file',
    by: '/payload/fileId',
    cache: true,
});

var verifyFileMimeType = async (context) => {
    var { cache } = context;
    var { file } = cache.get();
    
    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }
}

var tryPrepareImport = async (context) => {
    var { db, cache } = context;
    var { file } = cache.get();

    try {
        var parsedLines = EVApeCognitionCSV.parseLines({
            data: file.blob.toString()
        });
        var matchedData = await EVApeCognitionCSV.matchData({
            db, parsedLines, subjectType
        });
        var preparedObjects = EVApeCognitionCSV.makeObjects({
            matchedData, skipEmptyValues: true
        });
        var preparedObjects
        cache.merge({ matchedData, preparedObjects });
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
}

var verifySubjectType = async (context, next) => {
    var { db, message, cache } = context;
    var { studyId, subjectType } = message.payload;
    
    var subjectCRTs = await fetchAvailableCRTSettings({
        db, collections: [ 'subject' ], byStudyId,
        wrap: false, asTree: false
    });
    // FIXME: move that into above when asTree is false
    var subjectCRT = CRTSettingsList({ items: subjectCRTs }).find({
        'type': subjectType
    });

    if (!subjectCRT) {
        throw new ApiError(400, 'InvalidSubjectType');
    }

    cache.merge({ subjectCRT });
    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
