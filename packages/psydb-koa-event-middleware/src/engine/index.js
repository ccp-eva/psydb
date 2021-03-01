'use strict';
var compose = require('koa-compose'),
    
    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),

    prepareContext = require('./prepare-context'),
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

    createInitialChannelState,
    handleChannelEvent,
}) => {
    if (!createInitialChannelState) {
        throw new Error(inline`
            parameter "createInitialChannelState" must be a function
        `);
    }
    if (!handleChannelEvent) {
        throw new Error(inline`
            parameter "handleChannelEvent" must be a function
        `);
    }

    mqSettings = {
        ...defaultMqSettings,
        ...mqSettings
    };
    rohrpostSettings = {
        ...defaultRohrpostSettings,
        ...rohrpostSettings
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
        
        withMongoMQ(mqSettings),
        withRohrpost(rohrpostSettings),
        
        run({
            createInitialChannelState,
            handleChannelEvent,
        }),
    ])
}

module.exports = createMessageHandling;
