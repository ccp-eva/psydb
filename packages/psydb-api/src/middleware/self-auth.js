'use strict';
var debug = require('debug')('psydb:api:middleware:self-auth');
var config = require('@mpieva/psydb-api-config');

var { hasNone, hasOnlyOne } = require('@mpieva/psydb-core-utils');
var { ApiError, Self, withRetracedErrors } = require('@mpieva/psydb-api-lib');

var createSelfAuthMiddleware = (options = {}) => async(context, next) => {
    var { enableApiKeyAuthentication = false } = options;
    var { db, session, request } = context;
    var { personnelId, hasFinishedTwoFactorAuthentication } = session;
    var { apiKey } = request.query;

    if (enableApiKeyAuthentication && apiKey) {
        personnelId = await handleApiKeyAuth({ db, apiKey });
    }

    if (!personnelId) {
        debug('cant get personnelId from session or apiKey');
        throw new ApiError(401); // TODO
    }

    // FIXME: maybe pass personnelId w/o query and
    // query db in self itself
    var self = await Self({
        db,
        query: { _id: personnelId },
        apiKey,
        // see FIXME in self
        /*projection: {
            'scientific.state': true,
            'gdpr.state': true
        }*/
        enableTwoFactorAuthentication: true,
        hasFinishedTwoFactorAuthentication
    });

    var {
        record,
        researchGroupIds,
        hasRootAccess,
        twoFactorCodeStatus,
    } = self;

    if (!record) {
        debug('personnel record not found');
        throw new ApiError(401); // TODO: 401
    }

    if (!hasRootAccess && researchGroupIds.length < 1) {
        debug('user has no researchgroup and is not root user');
        throw new ApiError(401); // TODO: 401
    }

    if (twoFactorCodeStatus) {
        var { exists, matches } = twoFactorCodeStatus;
        if (exists) {
            if (matches === true) {
                session.hasFinishedTwoFactorAuthentication = true;
            }
            else if (matches === false) {
                debug('2FA code mismatch');
                throw new ApiError(803); // TODO
            }
            else {
                debug('2FA code input required');
                throw new ApiError(801); // TODO
            }
        }

    }

    // TODO: we need to store passwords in another collection
    // see Self() for more on this
    delete self.record.gdpr.state.internals.passwordHash;

    context.self = self;
    await next();
}

var handleApiKeyAuth = async (bag) => {
    var { db, apiKey } = bag;
    debug('apiKey:', apiKey);
    
    var apiKeyRecords = await withRetracedErrors(
        db.collection('apiKey').find({
            'apiKey': apiKey,
            'state.internals.isRemoved': { $ne: true }
        }).toArray()
    );

    if (hasNone(apiKeyRecords)) {
        debug('cant find apiKey')
        throw new ApiError(401) // TODO
    }
    if (!hasOnlyOne(apiKeyRecords)) {
        debug('found duplicate apiKey')
        throw new ApiError(409) // TODO
    }

    return apiKeysRecords[0].personnelId;
}

module.exports = createSelfAuthMiddleware;
