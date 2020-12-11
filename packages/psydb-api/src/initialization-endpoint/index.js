'use stirct';
var compose = require('koa-compose'),
    events = require('../endpoints/events/');

    withKoaBody = require('koa-body'),
    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost');

var initialize = async (context, next) => {
    var { db, request } = context;
    var { type, fixtureName } = request.body;

    // TODO: check if there is no user; else 404

    if (type === 'json') {
        await handleJsonFixture(db, fixturename);
    }
    else if (type === 'bson') {
        throw new Error('bson support not addded yet'); // TODO
    }
    else {
        throw new Error(400)
    }

    await next();
}

var handleJsonFixture = async (db, fixtureName) => {
    var fixture = require(`@mpieva/psydb-fixtures/json/${fixtureName}`);
}

module.exports = initialize;;
