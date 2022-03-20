'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var dispatchAddSubjectEvents = async ({
    dispatch

    experimentRecord,
    subjectRecord,

    comment,
    autoConfirm,
}) => {
    await dispatch({
        collection: 'experiment',
        channelId: experimentRecord._id,
        payload: { $push: {
            'state.selectedSubjectIds': subjectRecord._id,
            'state.subjectData': {
                subjectType: subjectRecord.type,
                subjectId: subjectRecord._id,
                invitationStatus: autoConfirm ? 'confirmed' : 'scheduled',
                participationStatus: 'unknown',
                comment: comment || '',
            }
        }}
    });

    await dispatch({
        collection: 'subject',
        channelId: subjectRecord._id,
        subChannelKey: 'scientific',
        payload: { $push: {
            'scientific.state.internals.invitedForExperiments': {
                type: experimentRecord.type,
                experimentId: experimentRecord._id,
                studyId: experimentRecord.state.studyId,
                timestamp: new Date(),
                status: autoConfirm ? 'confirmed' : 'scheduled',
            }
        }}
    });
}

module.exports = dispatchAddSubjectEvents;
