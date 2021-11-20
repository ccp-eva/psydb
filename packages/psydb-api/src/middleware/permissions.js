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

    var {
        hasRootAccess,
        researchGroupIds,
        forcedResearchGroupId,
        rolesByResearchGroupId,
    } = self;

    context.permissions = Permissions({
        hasRootAccess,
        researchGroupIds,
        forcedResearchGroupId,
        rolesByResearchGroupId,
    });

    await next();
}

module.exports = createPermissionMiddleware;
