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
        researchGroups,
        forcedResearchGroupId,
        rolesByResearchGroupId,
        
        availableSubjectTypes,
        availableLocationTypes,
        availableStudyTypes,
        availableLabMethods,
        availableHelperSetIds,
        availableSystemRoleIds,
    } = self;

    context.permissions = Permissions({
        hasRootAccess,
        researchGroupIds,
        researchGroups,
        forcedResearchGroupId,
        rolesByResearchGroupId,
        
        availableSubjectTypes,
        availableLocationTypes,
        availableStudyTypes,
        availableLabMethods,
        availableHelperSetIds,
        availableSystemRoleIds,
    });

    await next();
}

module.exports = createPermissionMiddleware;
