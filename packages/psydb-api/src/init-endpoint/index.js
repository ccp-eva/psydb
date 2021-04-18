'use strict';
var debug = require('debug')('psydb:api:init-endpoint');
    
var compose = require('koa-compose'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    createEventMiddleware = require('../endpoints/event/'),
    data = require('./data');

var jsonpointer = require('jsonpointer');

var init = async (context, next) => {
    var { db } = context;

    var personnelRecordCount = await (
        db.collection('personnel')
        .countDocuments()
    );

    if (personnelRecordCount !== 0) {
        throw new ApiError(404, 'personnelRecordCount is not zero');
    }

    var eventMiddleware = createEventMiddleware({
        enableMessageChecks: false,
        enableNotifications: false,
        forcedPersonnelId: data.rootAccountId,
    })

    var processEvent = createProcessEvent({ db, eventMiddleware });
    
    var messageContext = {};
    var send = messageContext.send = createSend(processEvent, messageContext);
    for (var messageOrLambda of data.messages) {
        if (typeof messageOrLambda === 'object') {
            await send(messageOrLambda);
        }
        else if (typeof messageOrLambda === 'function') {
            await messageOrLambda(messageContext);
        }
        else {
            throw new Error(
                'fixture definitions should be function or object'
            );
        }
            /*await eventMiddleware(
            { db, request: { body: message }},
            noop
        );*/
    }

    //var root = await db.collection('personnel').findOne();

    context.body = ResponseBody({ statusCode: 200 });

    await next();
}

var noop = async () => {};

var createProcessEvent = ({ eventMiddleware, db }) => async (message) => {
    var context = { db, request: { body: message }};
    await eventMiddleware(context, noop);
    return { status: 200, body: context.body };
};

var createSend = (processEvent, context) => async (message, onSuccess) => {
    console.log(message.type);
    var { status, body } = await processEvent(message);
    if (status === 200) {
        var modified = body.data;
        modified.forEach(it => {
            var path = (
                it.subChannelKey === undefined
                ? `/knownEventIds/${it.collectionName}/${it.channelId}`
                : `/knownEventIds/${it.collectionName}/${it.subChannelKey}/${it.channelId}`
            );
            jsonpointer.set(
                context,
                path,
                it.lastKnownEventId
            );
            jsonpointer.set(
                context,
                `/lastChannel/${it.collectionName}`,
                it.channelId
            );
        });
        if (onSuccess) {
            onSuccess(body, context);
        }
    }
    return { status, body }
};

module.exports = init;
