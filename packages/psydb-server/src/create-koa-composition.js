'use strict';
var compose = require('koa-compose'),
    session = require('koa-session'),
    maybeConnectMongoDB = require('db').createMiddleware,
    
    routing = require('./routing').createMiddleware;

var createKoaComposition = (app, config) => {

    var composition = compose([
        maybeConnectMongoDB({
            ...config.db
        }),
        session({
            signed: false, // i think this requires app.keys to be set
            renew: true, // renew session when close to ttl end
        }, app),
        routing(config),
    ]);

    return composition;
}
