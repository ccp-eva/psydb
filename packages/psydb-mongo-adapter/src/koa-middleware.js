'use strict';
var debug = require('debug')('psydb:mongo-adapter:koa-mw');
var MongoConnection = require('./mongo-connection');

module.exports = (config) => async (context, next) => {
    if (!config) {
        throw new Error('missing db config - check that "config.db" is set');
    }

    var connector = MongoConnection(config);
    await connector.connect();

    context.mongoConnector = connector;
    context.mongoClient = connector.getConnection();
    context.mongoDbName = connector.getSelectedDbName();
    context.db = connector.getSelectedDb();

    await next();
}
