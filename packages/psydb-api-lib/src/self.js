'use strict';
var debug = require('debug')('psydb:api:lib:self');
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
    
var Self = async ({
    db,
    query,
    //projection // see FIXME
}) => {
    // FIXME
    var projection = undefined;

    var self = {
        record: undefined,
        hasRootAccess: false,
        researchGroupIds: [],
        rolesByResearchGroupId: {},
    }

    var requiredProjection = {
        // FIXME: i want a minimal projection
        // but it will throw path collision when we want more
        // than the minimum
        //'scientific.state.hasRootAccess': true,
        //'scientific.state.researchGroupSettings': true,
        'scientific.state': true,
        'gdpr.state': true
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
        db.collection('personnel').aggregate([
            { $match: {
                $or: [
                    { 'scientific.state.hasRootAccess': true },
                    { 'scientific.state.researchGroupSettings.0': {
                        $exists: true
                    }},
                ],
                ...query
            }},
            // TODO: i think its better to have a seperate password
            // collection to avoid always having to project here
            // ane in other places
            //{ $project: { 'gdpr.state.internals.passwordHash': false }},
            { $project: projection }
        ])
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
