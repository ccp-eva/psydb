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
    EVApeCognitionCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,

    verifyStudyRecord,
    verifyLocationRecord,
    //verifyLabOperatorRecords, // TODO

    verifyFileRecord,
    verifyFileMimeType,
    
    verifySubjectCRT,
    tryPrepareImport,

    cacheSubjectIds,
    verifySameSubjectType,
    verifySameSubjectGroup,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    await next();
}

var verifyLocationRecord = verifyOneRecord({
    collection: 'location',
    by: '/payload/locationId',
    cache: true
});

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
    var { db, cache } = context;
    var { file } = cache.get();

    try {
        var parsedLines = EVApeCognitionCSV.parseLines({
            data: file.blob.toString()
        });
        var matchedData = await EVApeCognitionCSV.matchData({
            db, parsedLines
        });
        var preparedObjects = EVApeCognitionCSV.makeObjects({
            matchedData, skipEmptyValues: true
        });
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

    await next();
}

var verifySubjectCRT = verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
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

var cacheSubjectIds = async (context, next) => {
    var { db, cache } = context;
    var { preparedObjects } = cache.get();
    
    var subjectIds = [];
    for (var it of preparedObjects) {
        var { subjectData } = it;
        subjectIds.push(...subjectData.map(it => it.subjectId))
    }
    
    cache.merge({ subjectIds });
    await next();
}

var verifySameSubjectType = async (context, next) => {
    var { db, cache } = context;
    var { subjectCRT, subjectIds } = cache.get();

    var invalid = await withRetracedErrors(
        aggregateToArray({ db, subject: [
            { $match: {
                _id: { $in: subjectIds },
                type: { $ne: subjectCRT.getType() }
            }},
            { $project: { _id: true }}
        ]})
    );
    if (invalid.length > 0) {
        throw new ApiError(409); // TODO
    }

    await next();
}

var verifySameSubjectGroup = async (context, next) => {
    var { db, cache } = context;
    var { subjectIds, preparedObjects } = cache.get();
    
    var records = await withRetracedErrors(
        aggregateToArray({ db, subject: [
            { $match: { _id: { $in: subjectIds }}},
            { $project: {
                'groupId': '$scientific.state.custom.groupId', // XXX
            }}
        ]})
    );

    var groupIdsBySubject = keyBy({
        items: records,
        byProp: '_id',
        transform: (it => it.groupId)
    });

    var invalid = [];
    for (var [ oix, obj ] of preparedObjects.entries()) {
        var { subjectData } = obj;
        var groupId = undefined;
        for (var it of subjectData) {
            var itemGroupId = groupIdsBySubject[it.subjectId];
            if (groupId && !compareIds(groupId, itemGroupId)) {
                invalid.push({ ix: oix, item: obj });
            }
            else {
                groupId = itemGroupId;
            }
        }

        // FIXME: i dont like that
        obj.subjectGroupId = groupId;
    }

    if (invalid.length > 0) {
        throw new ApiError(409); // TODO
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
