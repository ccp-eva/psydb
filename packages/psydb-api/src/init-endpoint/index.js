'use strict';
var debug = require('debug')('psydb:api:init-endpoint');
    
var compose = require('koa-compose'),
    data = require('./data'),
    createEventMiddleware = require('../endpoints/event/');

var createInitEndpoint = ({
    config,
} = {}) => async (context, next) => {
    var { db, request } = context;

    var personnelRecordCount = await (
        db.collection('personnel')
        .count()
    );

    if (personnelRecordCount !== 0) {
        throw new Error(404); // TODO
    }

    var eventMiddleware = createEventMiddleware({
        enableValidation: false,
        enableNotifications: false,
        forcedPersonnelId: data.rootAccountId,
    })
    
    for (var message of data.messages) {
        await eventMiddleware(
            { db, request: { body: message }},
            noop
        );
    }

    await next();
}

var noop = async () => {};

module.exports = createInitEndpoint;
