'use strict';
var debug = require('debug')('psydb:api:endpoints:public-sign-in');

var bcrypt = require('bcrypt'),
    Self = require('../../lib/self');

var signIn = async (context, next) => {
    var { db, session, request } = context;
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

    var { record, systemRole } = self;

    if (!record) {
        debug('personnel record not found');
        throw new Error(401); // TODO: 401
    }

    var researchGroupIds = record.scientific.state.researchGroupIds;
    
    if (!systemRole) {
        debug('user has no system role');
        throw new Error(401); // TODO: 401
    }

    // if the user has no research groups check if their role has
    // root access
    if (researchGroupIds.length < 1) {
        if (!(systemRole && systemRole.state.hasRootAccess)) {
            debug('user has no researchgroups and role has no root acccess');
            throw new Error(401); // TODO: 401
        }
    }

    var storedHash = record.gdpr.state.internals.passwordHash;
    if (bcrypt.compareSync(password, storedHash)) {
        debug('passwords match, setting session personnelId');
        session.personnelId = record._id;
    }
    else {
        debug('passwords dont match');
        throw new Error(401); // TODO: 401
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
