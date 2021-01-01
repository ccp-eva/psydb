'use stirct';
var debug = require('debug')('psydb:api:endpoints:event');
    
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,
    nanoid = require('nanoid').nanoid,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),

    withContextSetup = require('./context-setup'),
    withMessageValidation = require('./message-validation'),

    callMessageHandler = require('./call-message-handler'),
    updateModifiedRecordStates = require('./update-modified-record-states');


var createMessageHandling = ({
    enableValidation = true,
    enableCheckAllowedAndPlausible = true,
    forcedPersonnelId,
} = {}) => {
    return compose([
        async (context, next) => { console.log(context); await next(); },
        withContextSetup({ forcedPersonnelId }),
        
        withMessageHandler,
        ...(
            enableValidation
            ? [ withMessageValidation ]
            : []
        ),
        ...(
            enableCheckAllowedAndPlausible
            ? [ withCheckAllowedAndPlausible ]
            : []
        ),

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
        
        // TODO: message handlers may not perform write ops
        // to the database, we might want to prevent that
        // by passing a modified db handle that only includes read ops
        callMessageHandler,
        updateModifiedRecordStates,
    ]);
};

module.exports = createMessageHandling;
