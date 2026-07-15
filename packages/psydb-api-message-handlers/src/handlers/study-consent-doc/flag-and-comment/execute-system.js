'use strict';

var executeSystemEvents = async (context) => {
    var { message, cache, dispatch, personnelId } = context;

    var { _id, props } = message.payload;
    var { hasIssue, containsSubjectUpdate, comment } = props;

    await dispatch({
        channelId: _id,
        collection: 'studyConsentDoc',
        
        payload: { $set: {
            'state.hasIssue': hasIssue,
            'state.containsSubjectUpdate': hasIssue,
            'state.comment': comment,
        }}
    });
}

module.exports = { executeSystemEvents }
