'use strict';
var compose = require('koa-compose');
var { ObjectId } = require('mongodb');
//var withVanillaSession = require('koa-session');
var withEncryptedSession = require('koa-encrypted-session');

var withSession = (app, config) => {
    var composition = compose([
        withEncryptedSession({
            signed: app.keys ? true : false, // config.keygrip
            //rolling: true, // reset cookie/ttl every request
            renew: true, // renew session when close to ttl end
            ...(config.session || {}),
            secret: config.sessionSecret,
        }, app),
        async (context, next) => {
            var { session } = context;
            var str = session.personnelId;
            if (str && /^[0-9a-fA-F]{24}$/.test(str)) {
                session.personnelId = ObjectId(str)
            }
            await next();
        }
    ]);

    return composition;
}

module.exports = withSession;
