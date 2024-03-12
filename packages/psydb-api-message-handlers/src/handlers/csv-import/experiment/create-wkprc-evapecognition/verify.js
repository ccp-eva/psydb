'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudy,
    verifyLocation,

    verifyFileRecord,
    verifyFileParsable,
    verifyFileDataMatchable
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

var verifyFileRecord = async (context) => {
    var { db, message, cache } = context;
    var { fileId } = message.payload;

    var file = await db.collection('file').findOne({ _id: fileId });
    if (!file) {
        throw new ApiError(409, 'FileNotFound');
    }
    if (file.mimetype !== 'text/csv') {
        throw new ApiError(409, 'file mime-type is not "text/csv"');
    }

    cache.merge({ file })
}

var verifyFileParsable = async (context) => {
    var { cache } = context;
    var { file } = cache.get();

    try {
        var parsed = parseEVApeCognitionCSV({
            data: file.blob.toString()
        });
        cache.merge({ parsed })
    }
    catch (e) {
        if (e instanceof CSVParseError) {
            throw new ApiError(409, 'cannot parse csv contents');
        }
        else {
            throw e
        }
    }
}

var verifyFileDataMatchable = async (context) => {
    var { cache } = context;
    var { parsed } = cache.get();

    var matchedData = await matchOnlineParticipationCSV({
        db, parsed, studyId
    });
    var hasErrors = matchedData.find(it => !!it.error);
    if (hasErrors) {
        throw new ApiError(409, 'csv has matching errors');
    }

    cache.merge({ matchedData });
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
