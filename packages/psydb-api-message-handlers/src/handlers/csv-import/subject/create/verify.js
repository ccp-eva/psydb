'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    compose,
    switchComposition,
    
    ApiError,
    FakeAjvError,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var { checkAgeFrameIntervalIsPlausible } = require('../utils');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifySubjectType,
    verifyAccessRights,
    verifyFileRecord,
    verifyFileMimeType,

    tryParseCSV,
    tryMatchData,
]);

var verifyFileMimeType = async (context) => {
    var { cache } = context;
    var { file } = cache.get();
    
    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }
}

var tryParseAndMatchCSV = async (context, next) => {
    var { cache } = context;
    var { file, subjectCRT } = cache.get();
    
    var parsed = parseOnlineParticipationCSV({
        data: file.blob.toString()
    })
    
    cache.merge({ parsed });
}

var tryMatchData = async (context, next) => {
    var { db, cache } = context;
    var { parsed, subjectCRT } = cache.get();

    var matched = await matchOnlineParticipationCSV({
        db, parsed, studyId
    });

    cache.merge({ matched });
}


var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.hasCollectionFlag('subject', 'write')) {
        throw new ApiError(403);
    }
    //if (!permissions.hasFlag('canImportSubjects')) {
    //    throw new ApiError(403);
    //}

    await next();
}

var verifySubjectType = async (context, next) => {
    var { db, message, cache } = context;
    var { studyId, subjectTypeKey } = message.payload;
    
    var subjectCRTs = await fetchAvailableCRTSettings({
        db, collections: [ 'subject' ], permissions
        wrap: false, asTree: false
    });
    // FIXME: move that into above when asTree is false
    var subjectCRT = CRTSettingsList({ items: subjectCRTs }).find({
        'type': subjectTypeKey
    });

    if (!subjectCRT) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    cache.merge({ subjectCRT });
    await next();
}

var verifyFileRecord = verifyOneRecord({
    collection: 'file',
    by: '/payload/fileId',
    cache: true,
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
