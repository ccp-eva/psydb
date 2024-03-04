'use strict';
var debug = require('debug')('psydb:api:lib:self');
var { ejson } = require('@mpieva/psydb-core-utils');
var withRetracedErrors = require('../with-retraced-errors');
var twoFactorAuth = require('../two-factor-auth')
var setup = require('./setup');

var Self = async (bag) => {
    var {
        db,
        query,
        //projection, // see FIXME
        apiKey,
        enableTwoFactorAuth = false,
        twoFactorCode = undefined,
    } = bag;

    var self = {
        record: undefined,
        hasRootAccess: false,
        researchGroupIds: [],
        rolesByResearchGroupId: {},
    }

    var personnelRecords = await fetchPersonnelRecords({
        db, query
    });
    if (personnelRecords.length != 1) {
        debug(`found ${personnelRecords.length} personnel records`);
        return self;
    }
    
    self.record = personnelRecords[0];

    self.personnelId = self.record._id;
    self.apiKey = apiKey;

    if (enableTwoFactorAuth && !apiKey) {
        debug('checking 2FA');
        var status = await twoFactorAuth.matchExistingCode({
            db,
            personnelId: self.personnelId,
            inputCode: twoFactorCode
        });
        debug('2FA status:', status);
        self.twoFactorCodeStatus = status;
    }

    await setup({ db, self });

    //console.dir(ejson(self), { depth: null });
    return self;
}

var fetchPersonnelRecords = async (bag) => {
    var { db, query, /*projection*/ } = bag
    // FIXME
    var projection = undefined;

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

    return personnelRecords;
}

module.exports = Self;
