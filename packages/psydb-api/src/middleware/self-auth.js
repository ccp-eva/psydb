'use strict';
var debug = require('debug')('psydb:api:middleware:self-auth');
var { performSelfAuth } = require('@mpieva/psydb-api-self-auth');

var createSelfAuthMiddleware = (options = {}) => async (context, next) => {
    var { enableApiKeyAuth = false } = options;
    var { db, session, request, ip, apiConfig } = context;

    context.self = await performSelfAuth({
        db, session, request, ip, apiConfig, enableApiKeyAuth
    });

    await next();
}

module.exports = createSelfAuthMiddleware;
