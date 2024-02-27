'use strict';
var debug = require('debug')('psydb:api:middleware:permissions');
var { Permissions } = require('@mpieva/psydb-common-lib');

var createPermissionMiddleware = ({
    endpoint
} = {}) => async (context, next) => {
    var { db, self } = context;

    if (!self) {
        debug('self not set in context');
        throw new Error(401); // TODO
    }

    context.permissions = Permissions.fromSelf({ self });

    await next();
}

module.exports = createPermissionMiddleware;
