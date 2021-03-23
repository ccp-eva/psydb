'use strict';
var debug = require('debug')('psydb:api:middleware:self-auth'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Self = require('@mpieva/psydb-api-lib/src/self');

var createSelfAuthMiddleware = ({
} = {}) => async(context, next) => {
    var { db, session } = context;

    if (!session.personnelId) {
        debug('session personnelId not set');
        throw new ApiError(401); // TODO
    }

    var self = await Self({
        db,
        query: {
            _id: session.personnelId
        },
        projection: {
            'scientific.state': true,
            'gdpr.state': true
        }
    });

    var { record, systemRole } = self;

    if (!record) {
        debug('personnel record not found');
        throw new Error(401); // TODO: 401
    }

    if (!systemRole) {
        debug('user has no system role');
        throw new Error(401); // TODO: 401
    }

    var researchGroupIds = record.scientific.state.researchGroupIds;
    
    // if the user has no research groups check if their role has
    // root access
    if (researchGroupIds.length < 1) {
        if (!(systemRole && systemRole.state.hasRootAccess)) {
            debug('user has no researchgroups and role has no root acccess');
            throw new Error(401); // TODO: 401
        }
    }

    context.self = self;
    await next();
}

module.exports = createSelfAuthMiddleware;
