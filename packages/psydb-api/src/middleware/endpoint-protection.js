'use strict';
var debug = require('debug')('psydb:api:middleware:endpoint-protection');

var createEndpointProtectionMiddleware = ({
    endpoint
} = {}) => async (context, next) => {
    var { permissions } = context;

    if (!endpoint) {
        debug('endpoint parameter missing, denying access');
        throw new Error(403) // TODO
    }
    if (!permissions.canAccessEndpoint(endpoint)) {
        debug('endpoint access denied');
        throw new Error(403) // TODO
    }

    await next();
}

module.exports = createEndpointProtectionMiddleware;
