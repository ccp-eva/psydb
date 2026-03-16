'use strict';
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');

var makeClean = async (context, args) => {
    var { db, dispatch } = context;
    var [{ collection, channelId, subChannelKey }] = args;
    
    var metapath = '_rohrpostMetadata';
    var statepath = 'state';
    if (subChannelKey) {
        metapath = subChannelKey + '.' + metapath;
        statepath = subChannelKey + '.' + statepath;
    }
    
    var meta = await dispatch({
        collection, channelId, subChannelKey,
        type: 'MAKE_CLEAN',
        payload: {
            $set: { [`${metapath}.EXECUTED_MAKE_CLEAN`] : true },
            $unset: { [statepath]: true }
        }
    });
    
    var { lastKnownEventId } = meta;

    // TODO: clean events
}

module.exports = makeClean;
