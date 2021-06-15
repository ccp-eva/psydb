'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var dispatchAddSubjectEvents = async ({
    db,
    rohrpost,
    personnelId,

    experimentRecord,
    subjectRecord
}) => {

    var experimentChannel = (
        rohrpost.openCollection('experiment').openChannel({
            id: experimentRecord._id
        })
    )

    // FIXME
    var lastKnownExperimentEventId = experimentRecord.events[0]._id;
    await experimentChannel.dispatchMany({
        lastKnownEventId: lastKnownExperimentEventId,
        messages: [
            ...PushMaker({ personnelId }).all({
                '/state/selectedSubjectIds': subjectRecord._id,
                '/state/subjectData': {
                    subjectType: subjectRecord.type,
                    subjectId: subjectRecord._id,
                    invitationStatus: 'scheduled',
                    participationStatus: 'unknown'
                }
            })
        ]
    });

    var subjectChannel = (
        rohrpost.openCollection('subject').openChannel({
            id: subjectRecord._id
        })
    )

    // FIXME
    var lastKnownSubjectScientificEventId = subjectRecord.scientific.events[0]._id;
    await subjectChannel.dispatchMany({
        subChannelKey: 'scientific',
        lastKnownEventId: lastKnownSubjectScientificEventId,
        messages: [
            ...PushMaker({ personnelId }).all({
                '/state/internals/invitedForExperiments': {
                    experimentId: experimentRecord._id,
                    studyId: experimentRecord.state.studyId,
                    timestamp: new Date(),
                    status: 'scheduled',
                }
            }),
        ]
    })

}

module.exports = dispatchAddSubjectEvents;
