'use strict';
var KoaSession = require('koa-session'),
    SessionStore = require('./session-store');

module.exports = (app) => KoaSession({
    store: SessionStore(),
    signed: false, // i think this requires app.keys to be set
    renew: true, // renew session when close to ttl end
}, app);
