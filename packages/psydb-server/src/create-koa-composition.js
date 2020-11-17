'use strict';

var compose = require('koa-compose'),
    maybeConnectMongoDB = require('db').createMiddleware,
    
    session = require('./session/').createMiddleware,
    routing = require('./routing').createMiddleware;

var createKoaComposition = (app, config) => {

    var composition = compose([
        maybeConnectMongoDB({
            ...config.db
        }),
        session(app),
        routing(config),
    ]);

}
