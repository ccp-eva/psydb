'use strict';
var debug = require('debug')('psydb:api:sign-in'),
    bcrypt = require('bcrypt');

var signIn = async (context, next) => {
    var { db, session, request } = context;
    var { email, password } = request.body;

    var personnelRecords = await (
        db.collection('personnel').find({
            $and: [
                { 'scientific.state.systemRoleId': {
                    $exists: true
                }},
                { 'scientific.state.systemRoleId': {
                    $not: { $type: 10 } // bson type of null
                }},
            ],
            'gdpr.state.emails': { $elemMatch: {
                email,
                isPrimary: true,
            }},
        }, {
            'scientific.state.researchGroupIds': true,
            'gdpr.state.internals.passwordHash': true
        })
        .toArray()
    );

    if (personnelRecords.length < 1) {
        debug('no personnel records found');
        throw new Error(); // TODO: 401
    }
    if (personnelRecords.length > 1) {
        debug('multiple personnel records found');
        throw new Error(); // TODO: 401
    }

    var user = personnelRecords[0],
        storedHash = user.gdpr.state.internals.passwordHash;
    var { researchGroupIds, systemRoleId } = user.scientific.state;

    if (!systemRoleId) {
        debug('user has no system role');
        throw new Error(); // TODO: 401
    }

    // if the user has no research groups check if their role has
    // root access
    if (researchGroupIds.length < 1) {
        var role = await (
            db.collection('systemRole')
            .findOne({
                _id: systemRoleId
            })
        );
        if (!(role && role.state.hasRootAccess)) {
            debug('user has no researchgroups and role has no root acccess');
            throw new Error(); // TODO: 401
        }
    }

    if (bcrypt.compareSync(password, storedHash)) {
        debug('passwords match, setting session personnelId');
        session.personnelId = user._id;
    }
    else {
        debug('passwords dont match');
        throw new Error(); // TODO: 401
    }

    await next();
}

module.exports = signIn;
