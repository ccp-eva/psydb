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
