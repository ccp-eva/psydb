'use strict';

var { EJSON } = require('bson'),
    RawBody = require('raw-body'),
    inflate = require('inflation');

var createMiddleware = ({
    patchNode = false,
    patchKoa = true,

    limit = '1mb',
    encoding = 'utf-8',

    ejsonMimeType = 'application/mongodb-extjson',
    ejsonReplacer,
    ejsonSpace,
    ejsonOptions,
} = {}) => {

    return (context) => {

        if (!context.is(ejsonMimeType)) {
            // FIXME: empty object? no body?
            // throw error?
            return;
        }

        var raw = RawBody(inflate(context.req), {
            limit,
            encoding,
        })

        var ejsonArgs = [ raw ];
        if (ejsonReplacer) {
            ejsonArgs.push(ejsonReplacer);
        }
        if (ejsonSpace) {
            ejsonArgs.push(ejsonSpace);
        }
        if (ejsonOptions) {
            ejsonArgs.push(ejsonOptions);
        }

        var parsed = EJSON.parse(...ejsonArgs);
        
        if (patchKoa) {
            context.request.body = parsed;
        }
        else if (patchNode) {
            context.req.body = parsed;
        }
    }

}

module.exports = createMiddleware;
