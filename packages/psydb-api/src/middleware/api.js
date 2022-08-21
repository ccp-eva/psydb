'use strict';
var compose = require('koa-compose'),
    withMongoDB = require('@mpieva/psydb-mongo-adapter').createMiddleware,
    
    withSession = require('./session'),
    withErrorHandling = require('./errors'),
    withRouting = require('./routing');

var createApi = (app, config) => {

    var composition = compose([
        withErrorHandling(),
        withMongoDB(config.db),
        withSession(app, config),
        
        withRouting(config.routing),
    ]);

    return composition;
}

module.exports = createApi;
