'use stirct';
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),
    schemas = require('@mpieva/psydb-schema').messages;

var handleMessage = async (context, next) => {
    var { db, rohrpost, message } = context;
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

var composition = compose([
    async (context, next) => {
        context.message = context.request.body;
        context.message.personnelId = context.session.personnelId || null;
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
    handleMessage,
]);

module.exports = composition;
