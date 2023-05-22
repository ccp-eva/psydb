'use strict';
var debug = require('debug')('psydb:api:lib:self');
var { keyBy } = require('@mpieva/psydb-core-utils');
var withRetracedErrors = require('./with-retraced-errors');

    
var Self = async ({
    db,
    query,
    apiKey,
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

    var personnelRecords = await withRetracedErrors(
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
            { $match: {
                'scientific.state.internals.isRemoved': { $ne: true },
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
        self.personnelId = self.record._id;
        self.apiKey = apiKey;

        var {
            hasRootAccess,
            researchGroupSettings,
            internals = {}
        } = self.record.scientific.state;

        var { forcedResearchGroupId } = internals;

        self.hasRootAccess = hasRootAccess;
        self.forcedResearchGroupId = forcedResearchGroupId;

        var researchGroups = await withRetracedErrors(
            db.collection('researchGroup')
            .find((
                hasRootAccess
                ? {}
                : { _id: { $in: (
                    researchGroupSettings.map(it => it.researchGroupId)
                )}}
            ), { projection: { _id: true }}).toArray()
        );
        
        for (var it of researchGroups) {
            self.researchGroupIds.push(it._id);
        }

        var roles = await withRetracedErrors(
            db.collection('systemRole')
            .find({
                _id: { $in: (
                    researchGroupSettings.map(it => it.systemRoleId)
                )}
            }, { projection: { events: false }}).toArray()
        );

        if (roles.length > 0) {
            var rolesById = keyBy({
                items: roles,
                byProp: '_id'
            });

            for (var it of researchGroupSettings) {
                var gid = it.researchGroupId;
                var role = rolesById[it.systemRoleId];
                self.rolesByResearchGroupId[gid] = role;
            }
        }
    }

    return self;
}

module.exports = Self;
