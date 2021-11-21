'use strict';
var {
    intersect,
    without
} = require('@mpieva/psydb-core-utils');

var {
    SystemPermissionStages,
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var ApiError = require('./api-error');

var collectionHasSubChannels = (collection) => (
    allSchemaCreators[collection].hasSubChannels
);

var verifyRecordAccess = async (options) => {
    var {
        db,
        permissions,

        collection,
        recordId,
        recordIds,
        
        action,
        additionalFlags,
    } = options;

    if (recordId) {
        recordIds = [ recordId ];
    }

    if (!['read', 'write'].includes(action)) {
        throw new Error(`unknown action "${action}"`);
    }

    var {
        researchGroupIdsByCollection,
        researchGroupIdsByFlag
    } = permissions;

    if (
        action === 'read' &&
        researchGroupIdsByCollection.study.read.length < 1
    ) {
        throw new ApiError(403, {
            apiStatus: 'NoReadPermissionForCollection',
            data: { collection }
        });
    }

    if (
        action === 'write' &&
        researchGroupIdsByCollection.study.write.length < 1
    ) {
        throw new ApiError(403, {
            apiStatus: 'NoWritePermissionForCollection',
            data: { collection }
        });
    }

    var records = await (
        db.collection(collection).aggregate([
            { $match: {
                _id: { $in: recordIds }
            }},
            ...SystemPermissionStages({
                collection,
                permissions,
                action,
            }),
            AddLastKnownEventIdStage(),
            StripEventsStage(),
        ]).toArray()
    );

    if (records.length == recordIds.length) {
        throw new ApiError(403, {
            apiStatus: 'RecordAccessDenied',
            data: {
                action,
                inaccessibleRecordIds: without(
                    recordIds,
                    records.map(it => it._id)
                )
            }
        });
    }

    if (additionalFlags) {
        var allowedForCollection = (
            researchGroupIdsByCollection[collection][action]
        );
        var hasSubChannels = collectionHasSubChannels(collection);
        var requiredPermissionInRecord = (
            action === 'read'
            ? [ 'read', 'write' ]
            : [ 'write' ]
        );

        var inaccessibleWithFlag = [];
        for (var record of records) {
            var state = (
                hasSubChannels
                ? record.scientific.state
                : record.state
            );

            var allowedForRecord = (
                state.systemPermissions.accessRightsByResearchGroup
                .filter(it => (
                    allowedForCollection.includes(it.researchGroupId) &&
                    requiredPermissionInRecord.includes(it.permission)
                ))
                .map(it => it.researchGroupId)
            );

            for (var flag of additionalFlags) {
                var intersection = intersect(
                    allowedForCollection,
                    researchGroupIdsByFlag[flag]
                );
                if (intersection.length < 1) {
                    inaccessibleWithFlag.push({
                        recordId: record._id,
                        flag,
                    })
                }
            }
        }

        if (inaccessibleWithFlag.length > 0) {
            throw new ApiError(403, {
                apiStatus: 'RecordAccessDenied',
                data: {
                    action,
                    inaccessibleWithFlag
                }
            });
        }
    }

    if (recordId) {
        return records[0];
    }
    else {
        return records;
    }
}

module.exports = verifyRecordAccess;
