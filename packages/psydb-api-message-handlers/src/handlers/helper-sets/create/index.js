'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');
var GenericRecordHandler = require('../../../lib/generic-record-handler');

module.exports = GenericRecordHandler({
    collection: 'helperSet',
    op: 'create',
    triggerSystemEvents: async (context) => {
        await GenericRecordHandler.triggerSystemEvents(context);
        
        var {
            permissions,
            cache,
            dispatch,
        } = context;
        
        var { currentChannelId } = cache;

        var intendedResearchGroupIds = permissions.getResearchGroupIds();
        for (var it of intendedResearchGroupIds) {
            await dispatch({
                collection: 'researchGroup',
                channelId: it,
                payload: { $push: {
                    'state.helperSetIds': currentChannelId
                }}
            })
        } 
    },
});

