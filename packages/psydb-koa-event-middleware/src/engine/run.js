'use strict';
var { ObjectId } = require('mongodb');
var ejson = require('@cdxoo/tiny-ejson');
var { merge } = require('@mpieva/psydb-core-utils');

var {
    withRetracedErrors,
    createInitialChannelState,
    pathifyProps,
    mongoEscapeDeep,
} = require('@mpieva/psydb-api-lib');


// triggerMussageEffects ??
// runHandlers ??
// performUpdates ??
var run = () => async (context, next) => {
    var {
        db,
        rohrpost,
        messageHandler,
        self,
    } = context;
    var { personnelId, apiKey } = self;

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
        
        var meta = await withRetracedErrors(
            channel.dispatch({ subChannelKey, message: {
                personnelId,
                ...(apiKey && { apiKey }),
                payload: mongoEscapeDeep(payload) 
            }, mongoArrayFilters })
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
    }
    catch (error) {
        // TODO
        //await rohrpost.rollback()
        throw error;
    }

    // mails etc
    await messageHandler.triggerOtherSideEffects(context);

    await next();
}

module.exports = run;
