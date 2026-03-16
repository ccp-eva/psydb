'use strict';
var { withRetracedErrors, mongoEscapeDeep }
    = require('@mpieva/psydb-api-lib');

var dispatch = async (context, args) => {
    var { db, rohrpost, self, now } = context;
    var { personnelId, apiKey } = self;

    var [{
        collection, channelId, isNew,
        additionalChannelProps,

        channel, subChannelKey, mongoArrayFilters,
        type = undefined, payload,
    }] = args;

    var channel = channel || (
        rohrpost
        .openCollection(collection)
        .openChannel({ id: channelId, isNew, additionalChannelProps })
    );
    
    var meta = await withRetracedErrors(
        channel.dispatch({ subChannelKey, message: {
            // TODO: add type: 'CREATE/PATCH'
            // or maybe 'CREATE_CHANNEL' bc subchannels?
            ...( type && { type }),
            personnelId,
            ...(apiKey && { apiKey }),
            payload: mongoEscapeDeep(payload) 
        }, mongoArrayFilters, now })
    );

    meta.collectionName = meta.collection; // FIXME
    meta.isNew = isNew; // FIXME

    context.modifiedChannels = (
        context.modifiedChannels
        ? [ ...context.modifiedChannels, meta ]
        : [ meta ]
    )

    if (!channelId) {
        ({ channelId } = meta);
    }
    
    await withRetracedErrors(
        db.collection(collection).updateOne(
            { _id: channelId },
            payload
        )
    );
    
    //context.modifiedChannels = rohrpost.getModifiedChannels();
    //console.log(context.modifiedChannels);
    await withRetracedErrors(
        rohrpost.unlockModifiedChannels()
    );
    //console.log(rohrpost.getModifiedChannels());
    //console.log('BBBBBBBBBBBBBBB')

    /*var a = await db.collection(collection).findOne({
        _id: channelId,
    });
    console.log(a);*/
    
    return meta;
}

module.exports = dispatch;
