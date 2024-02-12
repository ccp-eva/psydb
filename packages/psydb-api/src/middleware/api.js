'use strict';
//var CustomConsole = require('./custom-console');
//global.console = new CustomConsole(process.stdout, process.stderr);

var compose = require('koa-compose');
var withMongoDB = require('@mpieva/psydb-mongo-adapter').createMiddleware;

var withApiConfig = require('./with-api-config');
var withNowDate = require('./with-client-timezone');
var withClientTimezone = require('./with-client-timezone');
var withClientI18N = require('./with-client-i18n');
var withSession = require('./session');
var withErrorHandling = require('./errors');
var withRouting = require('./routing');

var createApi = (bag) => {
    var { app, config, prefix = '/' } = bag;

    var composition = compose([
        withApiConfig(config),
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
