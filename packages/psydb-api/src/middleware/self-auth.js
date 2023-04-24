'use strict';
var debug = require('debug')('psydb:api:middleware:self-auth');
var { hasNone, hasOnlyOne } = require('@mpieva/psydb-core-utils');
var { ApiError, Self } = require('@mpieva/psydb-api-lib');

var createSelfAuthMiddleware = (options = {}) => async(context, next) => {
    var { enableApiKeyAuthentication = false } = options;
    var { db, session, request } = context;
    var { apiKey } = request.query;

    var { personnelId } = session;

    if (enableApiKeyAuthentication && apiKey) {
        debug('apiKey:', apiKey);
        
        var apiKeyRecords = await db.collection('apiKey').find({
            'apiKey': apiKey,
            'state.internals.isRemoved': { $ne: true }
        }).toArray()

        if (hasNone(apiKeyRecords)) {
            debug('cant find apiKey')
            throw new ApiError(401) // TODO
        }
        if (!hasOnlyOne(apiKeyRecords)) {
            debug('found duplicate apiKey')
            throw new ApiError(409) // TODO
        }

        ({ personnelId } = apiKeyRecords[0]);
    }

    if (!personnelId) {
        debug('cant get personnelId from session or apiKey');
        throw new ApiError(401); // TODO
    }

    var self = await Self({
        db,
        query: {
            _id: personnelId
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
