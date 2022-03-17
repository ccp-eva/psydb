'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var dispatchAddSubjectEvents = async ({
    db,
    rohrpost,
    personnelId,

    experimentRecord,
    subjectRecord,

    comment,
    autoConfirm,
}) => {

    var experimentChannel = (
        rohrpost.openCollection('experiment').openChannel({
            id: experimentRecord._id
        })
    )

    await experimentChannel.dispatchMany({
        messages: [
            ...PushMaker({ personnelId }).all({
                '/state/selectedSubjectIds': subjectRecord._id,
                '/state/subjectData': {
                    subjectType: subjectRecord.type,
                    subjectId: subjectRecord._id,
                    invitationStatus: autoConfirm ? 'confirmed' : 'scheduled',
                    participationStatus: 'unknown',
                    comment: comment || '',
                }
            })
        ]
    });

    var subjectChannel = (
        rohrpost.openCollection('subject').openChannel({
            id: subjectRecord._id
        })
    )

    await subjectChannel.dispatchMany({
        subChannelKey: 'scientific',
        messages: [
            ...PushMaker({ personnelId }).all({
                '/state/internals/invitedForExperiments': {
                    type: experimentRecord.type,
                    experimentId: experimentRecord._id,
                    studyId: experimentRecord.state.studyId,
                    timestamp: new Date(),
                    status: autoConfirm ? 'confirmed' : 'scheduled',
                }
            }),
        ]
    })

}

module.exports = dispatchAddSubjectEvents;
