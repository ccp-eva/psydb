'use strict';
var debug = require('debug')('psydb:api:endpoints:public-sign-in');
var bcrypt = require('bcrypt');
var { ApiError, Ajv, Self } = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var signIn = async (context, next) => {
    var { db, session, request } = context;
    
    var schema = Schema(),
        ajv = Ajv(),
        isValid = ajv.validate(schema, request.body);

    if (!isValid) {
        debug('/sign-in', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: ajv.errors }
        });
    }

    var { email, password } = request.body;

    var self = await Self({
        db,
        query: {
            'gdpr.state.emails': { $elemMatch: {
                email,
                isPrimary: true,
            }},
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

    var shadow = await db.collection('personnelShadow').findOne({
        _id: record._id,
    });
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

module.exports = signIn;
