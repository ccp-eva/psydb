'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var enums = require('@mpieva/psydb-schema-enums');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var {
    dispatchAddSubjectEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/add-subject',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        labProcedureTypeKey,
        experimentId,
        subjectId,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    if (experimentRecord.state.isCanceled) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    if (experimentRecord.type !== labProcedureTypeKey) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    );

    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    var studyRecord = cache.studyRecord = await (
        db.collection('study').findOne({
            _id: experimentRecord.state.studyId,
        })
    );

    var existingSubjectRecords = await (
        db.collection('subject').find({
            _id: { $in: (
                experimentRecord.state.subjectData
                .filter(it => (
                    !enums.unparticipationStatus.keys.includes(
                        it.participationStatus
                    )
                ))
                .map(it => (
                    it.subjectId
                ))
            ) },
        },{ projection: { type: true }}).toArray()
    )

    var existingSubjectCountByType = {};
    for (var it of existingSubjectRecords) {
        existingSubjectCountByType[it.type] = (
            (existingSubjectCountByType[it.type] || 0) + 1
        )
    }

    var {
        selectionSettingsBySubjectType
    } = studyRecord.state;

    var wantedSubjectCountByType = {};
    for (var it of selectionSettingsBySubjectType) {
        wantedSubjectCountByType[it.subjectRecordType] = it.subjectsPerExperiment;
    }

    var canAdd = (
        existingSubjectCountByType[subjectRecord.type] <
        wantedSubjectCountByType[subjectRecord.type]
    );
    if (!canAdd) {
        throw new ApiError(400, 'ExperimentIsFull');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var {
        experimentId,
        subjectId,
        comment = '',
        autoConfirm = false,
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
    } = cache;

    await dispatchAddSubjectEvents({
        db,
        rohrpost,
        personnelId,
        experimentRecord,
        subjectRecord,

        comment,
        autoConfirm,
    });
    
}

module.exports = handler;
