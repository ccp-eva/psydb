'use stirct';
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),
    schemas = require('@mpieva/psydb-schema').messages;

var dispatchers = {
    'systemRole/create': async ({ rohrpost, message }) => {
        return await handleStateUpdateMessage({
            collection: 'systemRole',
            rohrpost,
            message
        });
    },
    'systemRole/patch': async ({ rohrpost, message }) => {
        return await handleStateUpdateMessage({
            collection: 'systemRole',
            rohrpost,
            message
        });
    }
}

var dispatchIncomingMessage = async (context, next) => {
    var { db, rohrpost, message } = context;
    var { type } = message;

    if (!type) {
        throw new Error(400); // TODO
    }

    var dispatch = dispatchers[type];
    await dispatch({ rohrpost, message });

    console.log(message);
    //var records = await db.collection('mqMessageQueue').find().toArray()
    //console.log(records);
    rohrpost.openCollection('personnel').openChannel().dispatch({
        message,
    });
    var records = await db.collection('personnel').find().toArray()
    console.dir(records, { depth: null });
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
            context.message = context.request.body;
            context.message.personnelId = (
                context.session.personnelId || null
            );
            await next();
        },
        withMongoMQ({
            createId: () => ObjectId(),
            ephemeralCollectionName: 'mqMessageQueue',
            persistCollectionName: 'mqMessageHistory',
        }),
        async (context, next) => {
            context.correlationId = context.mqCorrelationId;
            await next();
        },
        withRohrpost({
            createChannelId: () => ObjectId(),
            createChannelEventId: () => ObjectId(),
        }),
        dispatchIncomingMessage,
    ]);
};

module.exports = createMessageHandling;
