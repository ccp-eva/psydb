'use strict';
var compose = require('koa-compose'),
    withSession = require('koa-session'),
    maybeConnectMongoDB = require('db').createMiddleware,
    
    withAjv = require('./ajv'),
    withSchemas = require('./schema');
    withRouting = require('./routing');

var createApi = (app, config) => {

    var composition = compose([
        maybeConnectMongoDB(config.db),
        withSession({
            ...(config.session || {}),
            signed: false, // i think this requires app.keys to be set
            //rolling: true, // reset cookie/ttl every request
            renew: true, // renew session when close to ttl end
        }, app),

        withAjv(),
        withSchemas(),
        withRouting(config.routing),
    ]);

    return composition;
}

module.exports = createApi;
