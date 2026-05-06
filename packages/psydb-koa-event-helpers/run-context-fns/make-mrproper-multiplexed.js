'use strict';
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');
var dispatchMultiplexed = require('./dispatch-multiplexed');

var makeMrproperMultiplexed = async (context, args) => {
    var { db } = context;
    var [{ collection, channelIds, now }] = args;

    // XXX: rohrpost channel locking if active doesnt handle root being
    // locked but subchannels unlocked
    await dispatchMultiplexed(context, [{
        collection, channelIds, now,
        type: 'MAKE_MRPROPER', doUnlock: false
    }]);
   
    var records = await withRetracedErrors(
        db.collection(collection).find({
            '_id': { $in: channelIds }
        }).toArray()
    );
    
    var keepEventIds = [];
    for (var it of records) {
        var { _rohrpostMetadata } = it;
        // XXX: rohrpost root meta doesnt know about subchannels; it should
        var { hasSubChannels } = _rohrpostMetadata;

        keepEventIds.push(
            it._rohrpostMetadata.eventIds.slice(-1)[0],
            it._rohrpostMetadata.eventIds[0]
        );

        if (hasSubChannels) {
            keepEventIds.push(
                it.gdpr._rohrpostMetadata.eventIds.slice(-1)[0],
                it.scientific._rohrpostMetadata.eventIds.slice(-1)[0],
            )
        }
    }

    await withRetracedErrors(
        db.collection(collection).removeMany({
            '_id': { $in: channelIds }
        })
    );
    
    await withRetracedErrors(
        db.collection('rohrpostEvents').removeMany({
            'collectionName': collection,
            'channelId': { $in: channelIds },
            '_id': { $nin: keepEventIds }
        })
    );
    await withRetracedErrors(
        await db.collection('rohrpostEvents').updateMany({
            'collectionName': collection,
            'channelId': { $in: channelIds },
        }, [
            // XXX: i want everything but the type removed; maybe it
            // should be stored elsewhere i.e. not in message but in
            // messageType; we need to implement this in rohrpost maybe?
            // XXX: maybe i want to actually keep that and only remove
            // payload ? because it contains personnelId and apiKey
            //{ $set: {
            //    'message': { 'type': '$message.type'}
            //}},
            { $unset: [
                'message.payload',
                //'additionalChannelProps', // NOTE: well keep that for now
            ]}
        ])
    );
}

module.exports = makeMrproperMultiplexed
