'use strict';
var { intersect } = require('@mpieva/psydb-core-utils');

var ApiError = require('./api-error');
var fetchRecordById = require('./fetch-record-by-id');

var verifyStudyAccess = async (options) => {
    var {
        db,
        permissions,
        studyId,
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

    var study = await fetchRecordById({
        db,
        permissions,
        collection: 'study',
        id: studyId
    });

    if (!study) {
        throw new ApiError(403, { apiStatus: 'StudyRecordNotAccessible' });
    }

    if (action === 'read') {
        return study;
    }

    if (action === 'write') {
        var recordResearchGroupIdsWithWritePermission = (
            study.state.accessRightsByResearchGroup
            .filter(it => (
                it.permission === 'write'
            ))
            .map(it => it.researchGroupId)
        );

        var intersection = intersect(
            researchGroupIdsByCollection.study.write,
            recordResearchGroupIdsWithWritePermission
        );

        if (intersection.length < 1) {
            throw new ApiError(403, { apiStatus: 'StudyRecordNotWritable' });
        }

        return study;
    }
}

module.exports = verifyStudyAccess;
