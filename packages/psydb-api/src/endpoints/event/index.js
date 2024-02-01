'use strict';
var debug = require('debug')('psydb:api:endpoints:event');
    
var compose = require('koa-compose');
var { ObjectId } = require('mongodb');
var { nanoid } = require('nanoid');

var {
    withEventEngine,
    // FIXME: theese will be moved inside handlers themselves
    // as they are distinct from the actual event engine
    withDefaultContextSetup,
    withDefaultResponseBody,
} = require('@mpieva/psydb-koa-event-middleware');

var availableMessageHandlers = require('@mpieva/psydb-api-message-handlers');

var createMessageHandling = ({
    enableMessageChecks = true,
    forcedPersonnelId,
} = {}) => {

    var mqSettings = {
        createId: () => nanoid(),
        createAdditionalEnvelopeProps: (context) => {
            var { personnelId, apiKey } = context.self;
            return {
                personnelId,
                ...(apiKey && { apiKey }),
            }
        },
        redactMessageOnQueue: (incomingMessage) => {
            // we dont want to store password in text form
            // see handlers/set-personnel-password
            var {
                password,
                newPassword,
                currentPassword,
                ...redactedPayload
            } = incomingMessage.payload;

            if (password, newPassword, currentPassword) {
                console.log('redacting payload password');
            }
            return {
                ...incomingMessage,
                payload: redactedPayload
            }
        },
        /*redactMessageOnPersist: (ephemeralMessage) => {
            // TODO: only while developing stuff
            var persistentMessage = ephemeralMessage;
            return persistentMessage;
        }*/
    };
    var rohrpostSettings = {
        createChannelId: () => ObjectId(),
        createChannelEventId: () => ObjectId(),
        createChannelSessionId: () => ObjectId(),

        enableTransactions: false,
        enableOptimisticLocking: false,
    };

    return compose([
        //async (context, next) => { console.dir(context, { depth: 3}); await next(); },
        withDefaultContextSetup({ forcedPersonnelId }),
        async (context, next) => {
            var { type, payload } = context.request.body;
            debug(type, JSON.stringify(payload));
            await next();
        },

        withEventEngine({
            mqSettings,
            rohrpostSettings,
            availableMessageHandlers,

            enableMessageChecks,
        }),

        withDefaultResponseBody,
    ]);
};

module.exports = createMessageHandling;
