'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, compareIds, createId } = require('@mpieva/psydb-api-lib');
var datefns = require('date-fns');
var { checkLabOperationAccess } = require('@mpieva/psydb-common-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-invitation-status',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    var {
        experimentId,
        subjectId,
        invitationStatus,
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    // TODO: this permission check needs review
    var studyRecord = await db.collection('study').findOne({
        _id: experimentRecord.state.studyId,
    }, { projection: { 'state.researchGroupIds': true }});

    var flags = [ 'canConfirmSubjectInvitation', 'canViewExperimentCalendar' ];
    var hasAnyAccess = (studyRecord?.state.researchGroupIds || []).some(
        (researchGroupId) => checkLabOperationAccess({
            permissions,
            researchGroupId,
            labOperationType: experimentRecord.type,
            flags,
            checkJoin: 'or',
        })
    );
    if (!hasAnyAccess) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                flags,
                checkJoin: 'or',
                labOperationTypes: [ experimentRecord.type ],
            }
        });
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    )

    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }
    
    var subjectDataIndex = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    );
    if (subjectDataIndex < 0) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    dispatch,
    dispatchProps,
    apiConfig,
    personnelId,
    now,
}) => {
    var { type: messageType, timezone, payload } = message;
    var {
        experimentId,
        subjectId,
        invitationStatus
    } = payload;

    var {
        experimentRecord,
        subjectRecord,
    } = cache;

    var eix = (
        experimentRecord.state.subjectData.findIndex(it => {
            return compareIds(it.subjectId, subjectId)
        })
    );

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            [`state.subjectData.${eix}.invitationStatus`]: invitationStatus
        }}
    });

    var six = (
        subjectRecord.scientific.state.internals.invitedForExperiments
        .findIndex(it => {
            return compareIds(it.experimentId, experimentId)
        })
    )

    var spath = (
        `scientific.state.internals.invitedForExperiments.${six}.status`
    );
    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $set: {
            [spath]: invitationStatus
        }}
    });

    var {
        dev_enableCSVSubjectContactHistoryImport: enableContactHistory = false
    } = apiConfig || {};
    var contactHistoryStatus = contactHistoryStatusMap[invitationStatus];
    if (enableContactHistory && contactHistoryStatus) {
        var comment = '';
        if (invitationStatus === 'confirmed') {
            // NOTE: formatted in server timezone
            var date = datefns.format(
                experimentRecord.state.interval.start,
                'dd.MM.yyyy HH:mm'
            );
            comment = `Terminbestätigung für ${date}`;
        }

        var _id = await createId();
        await dispatchProps({
            collection: 'subjectContactHistory',
            channelId: _id,
            isNew: true,
            additionalChannelProps: {
                type: 'phone', csvImportId: null, experimentId,
                subjectId, subjectType: subjectRecord.type,
                timezone,
                contactedBy: personnelId,
                contactedAt: now,
            },
            props: { status: contactHistoryStatus, comment },
            initialize: false, // NOTE no schema currently
        });
    }
}

var contactHistoryStatusMap = {
    'confirmed': 'contact-successful',
    'mailbox': 'mailbox',
    'contact-failed': 'contact-failed',
};

module.exports = handler;
