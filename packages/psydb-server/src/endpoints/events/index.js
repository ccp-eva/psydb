'use stirct';
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,
    nanoid = require('nanoid').nanoid,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),
    schemas = require('@mpieva/psydb-schema').messages,

    parseCollectionMessageType = require('./parse-collection-message-type'),
    createCollectionMessages = require('./create-collection-messages');

var dispatchers = {
    'collection/systemRole/create': async ({ rohrpost, message }) => {
        return await handleStateUpdateMessage({
            collection: 'systemRole',
            rohrpost,
            message
        });
    },
    'collection/systemRole/patch': async ({ rohrpost, message }) => {
        return await handleStateUpdateMessage({
            collection: 'systemRole',
            rohrpost,
            message
        });
    }
}

var dispatchIncomingMessage = async (context, next) => {
    var { db, schemas, rohrpost, message } = context;
    var { type, personnelId, payload } = message;

    if (!type) {
        throw new Error(400); // TODO
        // TODO: validate message schema
        // then we dont need the guard condition anymore
    }

    if (/^collection\//) {
        var { collection, op } = parseCollectionMessageType(type);

        // FIXME: dispatch silently ignores messages when id is set
        // but record doesnt exist
        var channel = (
            rohrpost
            .openCollection(collection)
            .openChannel({ id: payload.id, isNew: op === 'create' })
        );

        var collectionMessages = createCollectionMessages({
            personnelId,
            props: payload.props
        });
        for (var it of collectionMessages) {
            var { subChannelKey, ...message } = it;
            await channel.dispatch({ subChannelKey, message })
        }
    }

     

    //var dispatch = dispatchers[type];
    //await dispatch({ rohrpost, message });

    console.log(message);
    //var records = await db.collection('mqMessageQueue').find().toArray()
    //console.log(records);
    /*rohrpost.openCollection('personnel').openChannel().dispatch({
        message,
    });*/
    var records = await db.collection('personnel').find().toArray()
    //console.dir(records, { depth: 5 });
    await next();
};

var withMessageValidation = async (context, next) => {
    // TODO
    await next();
};

var withAccessControl = async (context, next) => {
    // TODO
    await next();
};

var createMessageHandling = ({
    enableValidation = true,
    enableAccessControl = true,
    forcedPersonnelId,
} = {}) => {
    return compose([
        ...(
            enableValidation
            ? [ withMessageValidation ]
            : []
        ),
        ...(
            enableAccessControl
            ? [ withAccessControl ]
            : []
        ),
        async (context, next) => {
            // TODO: mq needs to accept custom message metadata
            context.message = context.request.body;
            context.message.personnelId = (
                context.session.personnelId || forcedPersonnelId
            );
            await next();
        },
        withMongoMQ({
            //createId: () => ObjectId(),
            createId: () => nanoid(),
            ephemeralCollectionName: 'mqMessageQueue',
            persistCollectionName: 'mqMessageHistory',
        }),
        async (context, next) => {
            context.correlationId = context.mqCorrelationId;
            await next();
        },
        withRohrpost({
            createChannelId: () => nanoid(),
            createChannelEventId: () => nanoid(),
            //createChannelId: () => ObjectId(),
            //createChannelEventId: () => ObjectId(),
        }),
        dispatchIncomingMessage,
    ]);
};

module.exports = createMessageHandling;
