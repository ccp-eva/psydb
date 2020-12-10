'use strict';
var debug = require('debug')('psydb:api:permission-middleware'),
    Permissions = require('../permissions');

// TODO: im currently not actually doing stuff with 'enabled'
var createPermissionMiddleware = ({
    enabled = true
} = {}) => async (context, next) => {
    var { db, session } = context;

    if (!session.personnelId) {
        debug('session personnelId not set');
        throw new Error(401); // TODO
    }

    var personnelRecord = await (
        db.collection('personnel')
        .findOne({
            _id: session.personnelId
        }, {
            'scientific.state.researchGroupIds': true,
            'scientific.state.systemRoleId': true,
        })
    );

    if (!personnelRecord) {
        debug('personnel record not found');
        throw new Error(401); // TODO
    }

    var {
        researchGroupIds,
        systemRoleId
    } = personnelRecord.scientific.state;
    
    if (!systemRoleId) {
        debug('user has no system role');
        throw new Error(401); // TODO: 401
    }

    var systemRole = await (
        db.collection('systemRole')
        .findOne({ _id: systemRoleId }, { 'state': true })
    );

    if (!systemRole) {
        debug('system role not found');
        throw new Error(401); // TODO: 401
    }

    if (systemRole.state.hasRootAccess && researchGroupIds.length < 1) {
        debug('user has no researchgroups and role has no root acccess');
        throw new Error(401); // TODO: 401
    }

    context.permissions = Permissions({
        systemRole,
        researchGroupIds,
    });

    await next();
}

module.exports = createPermissionMiddleware;
