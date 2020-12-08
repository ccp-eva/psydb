'use strict';
var compose = require('koa-compose'),
    session = require('koa-session'),
    maybeConnectMongoDB = require('db').createMiddleware,
    
    routing = require('./create-routing');

var createKoaComposition = (app, config) => {

    var composition = compose([
        maybeConnectMongoDB(config.db),
        session({
            ...(config.session || {}),
            signed: false, // i think this requires app.keys to be set
            //rolling: true, // reset cookie/ttl every request
            renew: true, // renew session when close to ttl end
        }, app),
        routing(config.routing),
    ]);

    return composition;
}
