'use strict';
var executeSystemEvents = async (context) => {
    var { dispatch, message, personnelId } = context;
    var { researchGroupId } = message.payload;
    
    await dispatch({
        collection: 'personnel',
        channelId: personnelId,
        subChannelKey: 'scientific',
        payload: { $set: {
            'scientific.state.internals.forcedResearchGroupId': (
                researchGroupId
            )
        }}
    });
}

module.exports = { executeSystemEvents }
