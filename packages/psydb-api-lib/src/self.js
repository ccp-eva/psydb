'use strict';
var debug = require('debug')('psydb:api:lib:self');
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
    
var Self = async ({
    db,
    query,
    projection
}) => {
    var self = {
        record: undefined,
        hasRootAccess: false,
        researchGroupIds: [],
        rolesByResearchGroupId: {},
    }

    var requiredProjection = {
        'scientific.state.hasRootAccess': true,
        'scientific.state.researchGroupSettings': true,
    };

    projection = (
        projection
        ? {
            ...projection,
            ...requiredProjection
        }
        : requiredProjection
    );

    var personnelRecords = await (
        db.collection('personnel').find({
            $or: [
                { 'scientific.state.hasRootAccess': true },
                { 'scientific.state.researchGroupSettings.0': {
                    $exists: true
                }},
            ],
            ...query
        }, projection)
        .toArray()
    );

    if (personnelRecords.length === 1) {
        self.record = personnelRecords[0];
    }
    else {
        debug(`found ${personnelRecords.length} personnel records`);
    }

    if (self.record) {
        var {
            hasRootAccess,
            researchGroupSettings,
        } = self.record.scientific.state;

        self.hasRootAccess = hasRootAccess;
        
        var roles = await (
            db.collection('systemRole')
            .find({
                _id: { $in: (
                    researchGroupSettings.map(it => it.researchGroupId)
                )}
            }).toArray()
        );

        if (roles.length > 0) {
            var rolesById = keyBy({
                items: roles,
                byProp: '_id'
            });

            for (var it of researchGroupSettings) {
                var gid = it.researchGroupId,
                    role = rolesById[it.systemRoleId];
                self.rolesByResearchGroupId[gid] = role;
                self.researchGroupIds.push(gid);
            }
        }
    }

    return self;
}

module.exports = Self;
