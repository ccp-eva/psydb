'use strict';
var debug = require('debug')('psydb:api:middleware:permissions'),
    Permissions = require('@mpieva/psydb-api-lib/src/permissions');

var createPermissionMiddleware = ({
    endpoint
} = {}) => async (context, next) => {
    var { db, self } = context;

    if (!self) {
        debug('self not set in context');
        throw new Error(401); // TODO
    }

    var systemRole = self.systemRole,
        researchGroupIds = self.record.scientific.state.researchGroupIds;

    context.permissions = Permissions({
        systemRole,
        researchGroupIds,
    });

    await next();
}

module.exports = createPermissionMiddleware;
