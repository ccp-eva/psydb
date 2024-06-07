'use strict';
var debug = require('debug')('psydb:api-self-auth:performSelfAuth');
var { ApiError, Self, withRetracedErrors } = require('@mpieva/psydb-api-lib');
var maybeHandleApiKeyAuth = require('./maybe-handle-api-key-auth');

var performSelfAuth = async (bag) => {
    var { db, session, apiConfig, enableApiKeyAuth, request, ip } = bag;
    var { personnelId, hasFinishedTwoFactorAuth } = session;

    if (enableApiKeyAuth) {
        personnelId ||= await maybeHandleApiKeyAuth({
            db, request, ip, apiConfig
        });
    }

    if (!personnelId) {
        debug('cant get personnelId from session or apiKey');
        throw new ApiError(401); // TODO
    }

    var { apiKey } = request.query;

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
        enableTwoFactorAuth: (
            apiConfig.twoFactorAuth?.isEnabled
        ),
        hasFinishedTwoFactorAuth
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
                session.hasFinishedTwoFactorAuth = true;
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
    // NOTE: this should be obsolete
    delete self.record.gdpr.state.internals.passwordHash;

    return self;
}

module.exports = performSelfAuth;
