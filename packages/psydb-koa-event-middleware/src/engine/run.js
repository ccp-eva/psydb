'use strict';
var { ObjectId } = require('mongodb');
var ejson = require('@cdxoo/tiny-ejson');
var { merge } = require('@mpieva/psydb-core-utils');

var {
    createInitialChannelState,
    pathifyProps,
    mongoEscapeDeep,
} = require('@mpieva/psydb-api-lib');

var storeNextState = require('./store-next-state');
        

// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = ({
    //createInitialChannelState,
    handleChannelEvent
}) => async (context, next) => {
    var {
        db,
        rohrpost,
        messageHandler,
        personnelId,
    } = context;

    var usedDispatch = false;
    context.modifiedChannels = [];

    var dispatch = context.dispatch = async (options) => {
        var {
            collection,
            channelId,
            isNew,
            additionalChannelProps,

            channel,
            subChannelKey,
            payload,
            mongoArrayFilters,
        } = options;
        //console.dir(payload, { depth: null });

        var channel = channel || (
            rohrpost
            .openCollection(collection)
            .openChannel({
                id: channelId,
                isNew,
                additionalChannelProps
            })
        );
        
        var meta = await channel.dispatch({ subChannelKey, message: {
            personnelId,
            payload: mongoEscapeDeep(payload) 
        }, mongoArrayFilters });

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
        
        await db.collection(collection).updateOne(
            { _id: channelId },
            payload
        );
        
        //context.modifiedChannels = rohrpost.getModifiedChannels();
        //console.log('AAAAAAAAAAAAAAA')
        //console.log(context.modifiedChannels);
        await rohrpost.unlockModifiedChannels();
        //console.log(rohrpost.getModifiedChannels());
        //console.log('BBBBBBBBBBBBBBB')

        /*var a = await db.collection(collection).findOne({
            _id: channelId,
        });
        console.log(a);*/
    }

    var dispatchProps = context.dispatchProps = async (ps) => {
        var {
            initialize,
            recordType,
            props = {},
            additionalSchemaCreatorArgs,
            ...pass
        } = ps;
        var { collection, subChannelKey } = pass;
       
        var defaults = {};
        if (initialize) {
            defaults = await createInitialChannelState({
                db,
                collection,
                subChannelKey,
                recordType,
                additionalSchemaCreatorArgs,
            });
            props = merge(defaults.state, props);
        }

        var pathified = pathifyProps({
            subChannelKey,
            props
        });

        return await dispatch({
            ...pass,
            payload: { $set: pathified }
        });
    }

    try {
        await messageHandler.triggerSystemEvents(context);
        var modded = rohrpost.getModifiedChannels();
        if (modded.length !== 0) {
            throw new Error('temp error');
        }

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
    //console.log(modded);
    if (modded.length !== 0) {
        throw new Error('temp error 2');
        context.modifiedChannels = modded;
        await rohrpost.unlockModifiedChannels();
    }
    
    // mails etc
    await messageHandler.triggerOtherSideEffects(context);

    await next();
}

module.exports = run;
