'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { withRetracedErrors, mongoEscapeDeep }
    = require('@mpieva/psydb-api-lib');

var dispatchMultiplexed = async (context, args) => {
    var { db, rohrpost, self, now: context_now } = context;
    var { personnelId, apiKey } = self;
    
    var [{
        collection, channelIds, subChannelKey, 
        type = undefined, payload, now = context_now, doUnlock = true
    }] = args;

    var message = {
        // TODO: add type: 'CREATE/PATCH'
        // or maybe 'CREATE_CHANNEL' bc subchannels?
        ...( type && { type }),
        personnelId,
        ...(apiKey && { apiKey }),
        ...(payload && { payload: mongoEscapeDeep(payload) })
    }

    var mongoExtraUpdate = payload ? payload : undefined;
    if (doUnlock) {
        var metapath = '_rohrpostMetadata';
        if (subChannelKey) {
            metapath = subChannelKey + '.' + metapath;
        }
        mongoExtraUpdate = merge((mongoExtraUpdate || {}), { $set: {
            [`${metapath}.unprocessedEventIds`]: []
        }});
    }

    var out = await withRetracedErrors(
        rohrpost._experimental_dispatchMultiplexed({
            collection, channelIds, subChannelKey,
            messages: [ message ], mongoExtraUpdate,
            now, /* mongoArrayFilters */
        })
    );

    return out;
}

module.exports = dispatchMultiplexed;
