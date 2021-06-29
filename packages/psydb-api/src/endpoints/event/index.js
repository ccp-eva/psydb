'use strict';
var debug = require('debug')('psydb:api:endpoints:event');
    
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,
    nanoid = require('nanoid').nanoid,

    withContextSetup = require('./context-setup'),
    withResponseBody = require('./with-response-body');
    
var createEngine = require('@mpieva/psydb-koa-event-middleware').createEngine;

var availableMessageHandlers = require('@mpieva/psydb-api-message-handlers'),
    createInitialChannelState = require('./create-initial-channel-state'),
    handleChannelEvent = require('./handle-channel-event');

var createMessageHandling = ({
    enableMessageChecks = true,
    forcedPersonnelId,
} = {}) => {

    var mqSettings = {
        createId: () => nanoid(),
        createAdditionalEnvelopeProps: (context) => ({
            personnelId: context.personnelId
        }),
        redactMessageOnQueue: (incomingMessage) => {
            // we dont want to store password in text form
            // see handlers/set-personnel-password
            var { password, ...redactedPayload } = incomingMessage.payload;
            return {
                ...incomingMessage,
                payload: redactedPayload
            }
        },
        redactMessageOnPersist: (ephemeralMessage) => {
            // TODO: only while developing stuff
            var persistentMessage = ephemeralMessage;
            return persistentMessage;
        }
    };
    var rohrpostSettings = {
        createChannelId: () => nanoid(),
        createChannelEventId: () => nanoid(),
    };

    return compose([
        //async (context, next) => { console.dir(context, { depth: 3}); await next(); },
        withContextSetup({ forcedPersonnelId }),

        createEngine({
            mqSettings,
            rohrpostSettings,
            availableMessageHandlers,

            createInitialChannelState,
            handleChannelEvent,

            enableMessageChecks,
        }),

        withResponseBody,
        //async (context, next) => { console.dir(context, { depth: 3}); await next(); },
    ]);
};

module.exports = createMessageHandling;
