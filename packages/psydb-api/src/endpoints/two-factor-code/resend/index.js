'use strict';
var debug = require('debug')('psydb:api:endpoints:two-factor-code:match');

var {
    ApiError,
    Self,
    validateOrThrow,
    twoFactorAuth,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var resend = async (context, next) => {
    var { db, session, request, apiConfig } = context;
    var {
        personnelId,
        hasFinishedTwoFactorAuth,
    } = session;
    
    if (!personnelId) {
        debug('cant get personnelId from session or apiKey');
        throw new ApiError(401); // TODO
    }

    if (hasFinishedTwoFactorAuth) {
        debug('already finished 2fa');
        throw new ApiError(400);
    }
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });
    
    var self = await Self({
        db,
        query: { _id: personnelId },
        enableTwoFactorAuth: true,
    });
    
    var { record, hasRootAccess, researchGroupIds } = self;

    if (!record) {
        debug('personnel record not found');
        throw new ApiError(401); // TODO: 401
    }

    if (!hasRootAccess && researchGroupIds.length < 1) {
        debug('user has no researchgroup and is not root user');
        throw new ApiError(401); // TODO: 401
    }

    if (apiConfig.twoFactorAuth?.isEnabled) {
        debug('2FA Enabled');
        var recipientEmail = getRecipientMail(record.gdpr.state.emails);
        await twoFactorAuth.generateAndSendCode({
            db, personnelId: record._id, recipientEmail
        });
    }

    context.body = {
        metadata: { status: 200 },
        data: {}
    };
    await next();
}

// TODO: redundant
var getRecipientMail = (emails) => {
    if (!Array.isArray(emails)) {
        return;
    }

    var filtered = emails.filter(it => it.isPrimary);
    if (filtered.length < 1) {
        return;
    }
    else {
        return filtered[0].email;
    }
}

module.exports = resend;
