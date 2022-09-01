'use strict';
var {
    mongoEscapeDeep,
} = require('@mpieva/psydb-api-lib');


var resetSubjectInviteStatus = async (bag) => {
    var { 
        rohrpost, subjectIds, studyId,
        experimentId, experimentType, personnelId
    } = bag;
    var now = new Date();

    var removeUpdate = { $pull: {
        'scientific.state.internals.invitedForExperiments': {
            experimentId
        }
    }};

    await rohrpost._experimental_dispatchMultiplexed({
        collection: 'subject',
        channelIds: subjectIds,
        subChannelKey: 'scientific',
        messages: [ { personnelId, payload: mongoEscapeDeep(removeUpdate) }],
        mongoExtraUpdate: {
            ...removeUpdate,
            $set: {
                'scientific._rohrpostMetadata.unprocessedEventIds': []
            }
        }
    });
    
    var addUpdate = { $push: {
        'scientific.state.internals.invitedForExperiments': {
            type: experimentType,
            studyId,
            experimentId,
            timestamp: now,
            status: 'scheduled',
        }
    }};
    
    await rohrpost._experimental_dispatchMultiplexed({
        collection: 'subject',
        channelIds: subjectIds,
        subChannelKey: 'scientific',
        messages: [ { personnelId, payload: mongoEscapeDeep(addUpdate) }],
        mongoExtraUpdate: {
            ...addUpdate,
            $set: {
                'scientific._rohrpostMetadata.unprocessedEventIds': []
            }
        }
    });
}

module.exports = resetSubjectInviteStatus;
