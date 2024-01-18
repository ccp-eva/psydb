'use strict';
var compose = require('koa-compose');
var withMongoDB = require('@mpieva/psydb-mongo-adapter').createMiddleware;
    
var withNowDate = require('./with-client-timezone');
var withClientTimezone = require('./with-client-timezone');
var withClientI18N = require('./with-client-i18n');
var withSession = require('./session');
var withErrorHandling = require('./errors');
var withRouting = require('./routing');

var createApi = (bag) => {
    var { app, config, prefix = '/' } = bag;

    var composition = compose([
        withNowDate(), // TODO: pass now to mq/rohrpost
        withErrorHandling(),
        withClientTimezone(),
        withClientI18N(),
        withMongoDB(config.db),
        withSession(app, config),
        
        withRouting({ prefix }),
    ]);

    return composition;
}

module.exports = createApi;
