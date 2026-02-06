'use strict';
var compose = require('koa-compose');

var withMongoMQ = require('@cdxoo/koa-mongo-mq');
var MongoRohrpost = require('@cdxoo/mongo-rohrpost');

var prepareContext = require('./prepare-context');
var checkMessage = require('./check-message');
var run = require('./run');

var MessageHandlerGroup = require('../helpers/message-handler-group');

var {
    defaultMqSettings,
    defaultRohrpostSettings,
} = require('./defaults');


var createMessageHandling = (bag) => {
    var {
        enableMessageChecks = true,
        availableMessageHandlers,

        mqSettings,
        rohrpostSettings,
    } = bag;

    mqSettings = {
        ...defaultMqSettings,
        ...mqSettings
    };
    rohrpostSettings = {
        ...defaultRohrpostSettings,
        ...rohrpostSettings,
        // force auto unlock disabled as we do it manually
        disableChannelAutoUnlocking: true,
    };

    return compose([
        prepareContext({
            rootHandler: MessageHandlerGroup(availableMessageHandlers)
        }),

        ...(
            enableMessageChecks
            ? [ checkMessage ]
            : []
        ),

        async (context, next) => {
            context.potentiallyModifiedMessage = context.message;
            context.message = context.originalMessage;
            await next();
        },

        withMongoMQ(mqSettings),
        
        async (context, next) => {
            context.message = context.potentiallyModifiedMessage
            await next();
        },

        withMongoRohrpost(rohrpostSettings),
        
        run(),
    ])
}

var withMongoRohrpost = (options) => async (context, next) => {
    var { mongoClient, mongoDbName, correlationId } = context;

    context.rohrpost = MongoRohrpost({
        client: mongoClient, dbName: mongoDbName, correlationId,
        ...options
    })

    await next();
}

module.exports = createMessageHandling;
