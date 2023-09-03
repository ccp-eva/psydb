'use strict';
var compose = require('koa-compose');
var withMongoDB = require('@mpieva/psydb-mongo-adapter').createMiddleware;
    
var withClientTimezone = require('./with-client-timezone');
var withSession = require('./session');
var withErrorHandling = require('./errors');
var withRouting = require('./routing');

var createApi = (bag) => {
    var { app, config, prefix = '/' } = bag;

    var composition = compose([
        withErrorHandling(),
        withClientTimezone(),
        withMongoDB(config.db),
        withSession(app, config),
        
        withRouting({ prefix }),
    ]);

    return composition;
}

module.exports = createApi;
