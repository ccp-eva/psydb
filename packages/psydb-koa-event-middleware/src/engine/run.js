'use strict';
var storeNextState = require('./store-next-state');
var escapeDeep = require('./escape-deep');

// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = ({
    createInitialChannelState,
    handleChannelEvent
}) => async (context, next) => {
    var {
        db,
        rohrpost,
        messageHandler,
        personnelId,
    } = context;

    var usedDispatch = false;
    var dispatch = async (options) => {
        var {
            collection,
            channelId,
            isNew,
            additionalChannelProps,

            channel,
            payload,
        } = options;

        var channel = channel || (
            rohrpost
            .openCollection(collection)
            .openChannel({
                id: channelId,
                isNew,
                additionalChannelProps
            })
        );
        
        var r = await channel.dispatch({ message: {
            personnelId,
            payload: escapeDeep(payload) 
        }});

        if (!channelId) {
            ({ channelId } = r);
        }
        
        await db.collection(collection).updateOne(
            { _id: channelId },
            payload
        );
        
        context.modifiedChannels = rohrpost.getModifiedChannels();
        await rohrpost.unlockModifiedChannels();

        /*var a = await db.collection(collection).findOne({
            _id: channelId,
        });
        console.log(a);*/
    }

    context.dispatch = dispatch;

    try {
        await messageHandler.triggerSystemEvents(context);

        await storeNextState({
            createInitialChannelState,
            handleChannelEvent,
            context
        });
    }
    catch (error) {
        // TODO
        //await rohrpost.rollback()
        throw error;
    }

    // cache modified channels in context to be used
    // by middleware downstream
    var modded = rohrpost.getModifiedChannels();
    if (modded.length !== 0) {
        context.modifiedChannels = modded;
        await rohrpost.unlockModifiedChannels();
    }
    
    // mails etc
    await messageHandler.triggerOtherSideEffects(context);

    await next();
}

module.exports = run;
