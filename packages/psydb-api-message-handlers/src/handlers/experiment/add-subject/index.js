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
    prepareExperimentRecord,
    prepareSubjectRecord,
    prepareOpsTeamRecord,
    prepareLocationRecord,
    prepareLabProcedureSettingRecords,

    verifySubjectMovable,
    
    dispatchAddSubjectEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/add-subject',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {

    var {
        db,
        permissions,
        cache,
        message
    } = context;

    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        labProcedureTypeKey,
        experimentId,
        subjectId,
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: labProcedureTypeKey,
        experimentId,
    });

    var { experimentRecord } = cache;
    var { studyId, subjectData } = experimentRecord.state;
  
    await prepareSubjectRecord(context, {
        subjectId,
    });

    var { type: subjectTypeKey } = cache.subjectRecord;

    await prepareLabProcedureSettingRecords(context, {
        studyId,
        labProcedureTypeKey,
        subjectTypeKey,
    });

    var { labProcedureSettingRecords: settingRecords } = cache;
    if (settingRecords.length > 1) {
        throw new ApiError(400, 'DuplicateLabProceduresFound');
    }

    var { subjectsPerExperiment } = settingRecords[0].state;
    var existingCount = (
        subjectData
        .filter(it => (
            !enums.unparticipationStatus.keys.includes(
                it.participationStatus
            )
        ))
        .reduce((acc, it) => (acc + 1), 0)
    );

    /*var existingSubjectRecords = await (
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
    );*/
    var canAdd = (
        existingCount < subjectsPerExperiment
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
