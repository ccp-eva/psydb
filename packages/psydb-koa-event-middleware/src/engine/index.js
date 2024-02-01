'use strict';
var compose = require('koa-compose'),
    
    withMongoMQ = require('@cdxoo/koa-mongo-mq'),
    withRohrpost = require('@cdxoo/koa-mongo-rohrpost'),

    prepareContext = require('./prepare-context'),
    checkMessage = require('./check-message'),
    run = require('./run'),

    MessageHandlerGroup = require('../helpers/message-handler-group');

var {
    defaultMqSettings,
    defaultRohrpostSettings,
} = require('./defaults');


var createMessageHandling = ({
    enableMessageChecks = true,
    availableMessageHandlers,

    mqSettings,
    rohrpostSettings,
}) => {
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

        withRohrpost(rohrpostSettings),
        
        run(),
    ])
}

module.exports = createMessageHandling;
