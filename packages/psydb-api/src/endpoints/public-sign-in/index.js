'use strict';
var debug = require('debug')('psydb:api:endpoints:public-sign-in');

var bcrypt = require('bcrypt');
var { range } = require('@mpieva/psydb-core-utils');
var {
    ApiError,
    Self,
    validateOrThrow,
    withRetracedErrors,
    twoFactorAuth,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var signIn = async (context, next) => {
    var { db, session, request, apiConfig } = context;
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { email, password } = request.body;

    var self = await Self({
        db,
        query: {
            'gdpr.state.emails': { $elemMatch: {
                email,
                isPrimary: true,
            }},
            'scientific.state.canLogIn': true
        },
        projection: {
            'scientific.state': true,
            'gdpr.state': true
        }
    });

    var { record, researchGroupIds, hasRootAccess } = self;

    if (!record) {
        debug('personnel record not found');
        throw new ApiError(401); // TODO: 401
    }
    
    if (!hasRootAccess && researchGroupIds.length < 1) {
        debug('user has no researchgroup and is not root user');
        throw new ApiError(401); // TODO: 401
    }

    var shadow = await withRetracedErrors(
        db.collection('personnelShadow').findOne({
            _id: record._id,
        })
    );
    if (!shadow) {
        debug('user has no shadow item');
        throw new ApiError(401); // TODO: 401
    }

    var storedHash = shadow.passwordHash;
    if (bcrypt.compareSync(password, storedHash)) {
        debug('passwords match, setting session personnelId');
        session.personnelId = record._id;
    }
    else {
        debug('passwords dont match');
        throw new ApiError(401); // TODO: 401
    }

    if (apiConfig.twoFactorAuth?.isEnabled) {
        debug('2FA Enabled');
        var recipientEmail = getRecipientMail(record.gdpr.state.emails);
        await twoFactorAuth.generateAndSendCode({
            db, personnelId: record._id, recipientEmail
        });
        throw new ApiError(801);
    }

    // we dont want the password hash to be transferred
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

module.exports = signIn;
