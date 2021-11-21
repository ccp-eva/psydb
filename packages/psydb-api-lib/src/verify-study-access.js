'use strict';
var { intersect, without } = require('@mpieva/psydb-core-utils');
var {
    SystemPermissionStages,
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-mongo-stages');

var ApiError = require('./api-error');
var fetchRecordById = require('./fetch-record-by-id');

var verifyStudyAccess = async (options) => {
    var {
        db,
        permissions,
        studyId,
        studyIds,
        action
    } = options;

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
            apiStatus: 'NoReadPermissionForStudyCollection'
        });
    }

    if (
        action === 'write' &&
        researchGroupIdsByCollection.study.write.length < 1
    ) {
        throw new ApiError(403, {
            apiStatus: 'NoWritePermissionForStudyCollection'
        });
    }

    if (studyId) {
        studyIds = [ studyId ];
    }

    var studies = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: studyIds }
            }},
            ...SystemPermissionStages({
                collection: 'study',
                permissions,
                action,
            }),
            AddLastKnownEventIdStage(),
            StripEventsStage(),
        ]).toArray()
    );

    if (studies.length == studyIds.length) {
        throw new ApiError(403, {
            apiStatus: 'StudyRecordsNotAccessible',
            data: {
                action,
                inaccessibleStudyIds: without(
                    studyIds,
                    studies.map(it => it._id)
                )
            }
        });
    }

    //if (action === 'write') {
    //    var recordResearchGroupIdsWithWritePermission = (
    //        study.state.accessRightsByResearchGroup
    //        .filter(it => (
    //            it.permission === 'write'
    //        ))
    //        .map(it => it.researchGroupId)
    //    );

    //    var inaccessibleStudyIds = [];
    //    for (var study of studies) {
    //        var intersection = intersect(
    //            researchGroupIdsByCollection.study.write,
    //            recordResearchGroupIdsWithWritePermission
    //        );
    //        if (intersection.length < 1) {
    //            inaccessibleStudyIds.push(study._id)
    //        }
    //    }

    //    if (inaccessibleStudyIds.length) {
    //        throw new ApiError(403, {
    //            apiStatus: 'StudyRecordsNotWritable',
    //            data: {
    //                inaccessibleStudyIds
    //            }
    //        });
    //    }
    //}

    if (studyId) {
        return studies[0];
    }
    else {
        return studies;
    }
}

module.exports = verifyStudyAccess;
