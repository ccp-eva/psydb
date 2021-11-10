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
        // see FIXME in self
        /*projection: {
            'scientific.state': true,
            'gdpr.state': true
        }*/
    });

    var { record, researchGroupIds, hasRootAccess } = self;

    if (!record) {
        debug('personnel record not found');
        throw new Error(401); // TODO: 401
    }

    if (!hasRootAccess && researchGroupIds.length < 1) {
        debug('user has no researchgroup and is not root user');
        throw new Error(401); // TODO: 401
    }

    // TODO: we need to store passwords in another collection
    // see Self() for more on this
    delete self.record.gdpr.state.internals.passwordHash;

    context.self = self;
    await next();
}

module.exports = createSelfAuthMiddleware;
