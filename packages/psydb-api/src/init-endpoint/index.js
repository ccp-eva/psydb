'use strict';
var debug = require('debug')('psydb:api:init-endpoint');
    
var compose = require('koa-compose'),
    ResponseBody = require('../lib/response-body'),
    ApiError = require('../lib/api-error'),
    createEventMiddleware = require('../endpoints/event/'),
    data = require('./data');

var init = async (context, next) => {
    var { db } = context;

    var personnelRecordCount = await (
        db.collection('personnel')
        .countDocuments()
    );

    if (personnelRecordCount !== 0) {
        throw new ApiError(404);
    }

    var eventMiddleware = createEventMiddleware({
        enableMessageChecks: false,
        enableNotifications: false,
        forcedPersonnelId: data.rootAccountId,
    })
    
    for (var message of data.messages) {
        await eventMiddleware(
            { db, request: { body: message }},
            noop
        );
    }

    var root = await db.collection('personnel').findOne();

    context.body = ResponseBody({ statusCode: 200 });

    await next();
}

var noop = async () => {};

module.exports = init;
