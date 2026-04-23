'use strict';
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');
var dispatch = require('./dispatch');

var makeClean = async (context, args) => {
    var { db } = context;
    var [{ collection, channelId, subChannelKey, now }] = args;
    
    var metapath = '_rohrpostMetadata';
    var statepath = 'state';
    if (subChannelKey) {
        metapath = subChannelKey + '.' + metapath;
        statepath = subChannelKey + '.' + statepath;
    }
    
    var meta = await dispatch(context, [{
        collection, channelId, subChannelKey, now,
        type: 'MAKE_CLEAN',
        payload: { $set: {
            [`${metapath}.EXECUTED_MAKE_CLEAN`] : true,
            [statepath]: '[[REDACTED]]'
        }}
    }]);
    
    var { lastKnownEventId } = meta;
    await withRetracedErrors(
        db.collection('rohrpostEvents').updateMany(
            {
                collectionName: collection, channelId: channelId,
                ...(subChannelKey && { subChannelKey }),
                _id: { $ne: lastKnownEventId },
            },
            { $set: { 'message.payload': '[[REDACTED]]' }}
        )
    )
}

module.exports = makeClean;
