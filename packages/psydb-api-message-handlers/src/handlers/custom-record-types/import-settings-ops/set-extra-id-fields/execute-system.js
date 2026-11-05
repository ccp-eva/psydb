'use strict';

var executeSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { _id, values } = message.payload;

    await dispatch({
        channelId: _id,
        collection: 'customRecordType',
        
        payload: { $set: {
            'state.importSettings.extraIdFields': values,
        }}
    });
}

module.exports = { executeSystemEvents }
