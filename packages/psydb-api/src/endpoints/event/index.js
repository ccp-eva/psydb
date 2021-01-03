'use stirct';
var debug = require('debug')('psydb:api:endpoints:event');
    
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,
    nanoid = require('nanoid').nanoid,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),

    withRecordSchemas = require('../../middleware/record-schemas'),

    withContextSetup = require('./context-setup'),
    withMessageHandler = require('./with-message-handler'),
    withModifiedChannels = require('./with-modified-channels'),
    withResponseBody = require('./with-response-body'),
    
    checkMessage = require('./check-message'),
    triggerSystemEvents = require('./trigger-system-events'),
    updateModifiedRecordStates = require('./update-modified-record-states'),
    unlockModifiedChannels = require('./unlock-modified-channels');


var createMessageHandling = ({
    enableMessageChecks = true,
    forcedPersonnelId,
} = {}) => {
    return compose([
        async (context, next) => { console.log(context); await next(); },
        withContextSetup({ forcedPersonnelId }),
        withRecordSchemas(),

        withMessageHandler,
        ...(
            enableMessageChecks
            ? [ checkMessage ]
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
            disableChannelAutoUnlocking: true,
        }),
        
        // TODO: message handlers may not perform write ops
        // to the database, we might want to prevent that
        // by passing a modified db handle that only includes read ops
        triggerSystemEvents,

        withModifiedChannels,
        updateModifiedRecordStates,
        unlockModifiedChannels,

        // triggerOtherSideEffects // mails etc

        withResponseBody
    ]);
};

module.exports = createMessageHandling;
