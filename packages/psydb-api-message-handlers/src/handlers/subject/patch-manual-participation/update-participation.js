'use strict';

var updateParticipation = async (context) => {
    var { message, dispatch, cache } = context;
    var { pix, patchedItem } = cache;

    var participationPath = (
        `scientific.state.internals.participatedInStudies.${pix}`
    );

    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $set: {
            [participationPath]: patchedItem
        }},
    });
}

module.exports = updateParticipation;
