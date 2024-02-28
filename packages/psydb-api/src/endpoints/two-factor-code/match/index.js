'use strict';
var debug = require('debug')('psydb:api:endpoints:two-factor-code:match');

var {
    ApiError,
    Self,
    validateOrThrow,
    twoFactorAuth,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var match = async (context, next) => {
    var { db, session, request } = context;
    var { personnelId } = session;
    
    if (!personnelId) {
        debug('cant get personnelId from session or apiKey');
        throw new ApiError(401); // TODO
    }
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });
    
    var { twoFactorCode } = request.body;
    twoFactorCode = twoFactorCode.trim();

    var self = await Self({
        db,
        query: { _id: personnelId },
        enableTwoFactorAuth: true,
        twoFactorCode
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
                await twoFactorAuth.removeCode({ db, personnelId });
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

    context.body = {
        metadata: { status: 200 },
        data: {
            record: self.record,
            systemRole: self.systemRole,
        }
    };
    await next();
}

module.exports = match;
