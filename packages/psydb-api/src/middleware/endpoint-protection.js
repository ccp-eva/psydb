'use strict';
var debug = require('debug')('psydb:api:middleware:endpoint-protection');
var { ApiError } = require('@mpieva/psydb-api-lib');

var createEndpointProtectionMiddleware = ({
    endpoint
} = {}) => async (context, next) => {
    var { permissions } = context;

    if (!endpoint) {
        debug('endpoint parameter missing, denying access');
        throw new ApiError(403, 'EndpointAccessDenied');
    }
    if (!permissions.canAccessEndpoint(endpoint)) {
        debug('endpoint access denied');
        throw new ApiError(403, 'EndpointAccessDenied');
    }

    await next();
}

module.exports = createEndpointProtectionMiddleware;
