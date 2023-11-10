'use strict';
var debug = require('debug')('psydb:api:lib:self');
var { ejson } = require('@mpieva/psydb-core-utils');
var withRetracedErrors = require('../with-retraced-errors');
var setup = require('./setup');

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

        await setup({ db, self });
    }

    //console.dir(ejson(self), { depth: null });
    return self;
}

module.exports = Self;
