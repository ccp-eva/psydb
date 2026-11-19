'use strict';
var debug = require('debug')('psydb:api:endpoints:crt-settings:export');

var { ejson } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { ApiError } = require('@mpieva/psydb-api-lib');

var EXPORT_FORMAT = 'psydb-crt-export';
var EXPORT_VERSION = 1;

var HELPER_SET_FIELD_TYPES = [ 'HelperSetItemId', 'HelperSetItemIdList' ];

// NOTE: exports all non-removed custom record types together with
// the helper sets (and their items) that the crt fields reference;
// the result is meant to be fed into the "import-crt-export"
// automation script on another system
var exportEndpoint = async (context, next) => {
    var { db, permissions } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var crtRecords = await aggregateToArray({ db, customRecordType: [
        { $match: { 'state.internals.isRemoved': { $ne: true }}},
        { $project: { _rohrpostMetadata: false }},
        { $sort: { collection: 1, type: 1 }},
    ]});

    var helperSetIds = gatherHelperSetIds(crtRecords);

    var helperSets = await aggregateToArray({ db, helperSet: [
        { $match: {
            _id: { $in: helperSetIds },
            'state.internals.isRemoved': { $ne: true },
        }},
        { $project: { _rohrpostMetadata: false }},
    ]});

    var helperSetItems = await aggregateToArray({ db, helperSetItem: [
        { $match: {
            setId: { $in: helperSetIds },
            'state.internals.isRemoved': { $ne: true },
        }},
        { $project: { _rohrpostMetadata: false }},
        { $sort: { sequenceNumber: 1, _id: 1 }},
    ]});

    debug(
        'exporting', crtRecords.length, 'crts',
        helperSets.length, 'helper sets',
        helperSetItems.length, 'helper set items'
    );

    var out = {
        format: EXPORT_FORMAT,
        version: EXPORT_VERSION,
        exportedAt: new Date(),
        customRecordTypes: crtRecords,
        helperSets: helperSets.map(it => ({
            ...it,
            items: helperSetItems.filter(item => (
                String(item.setId) === String(it._id)
            ))
        })),
    };

    var timestamp = out.exportedAt.toISOString().replace(/[:.]/g, '-');
    context.set('Content-Type', 'application/json; charset=utf-8');
    context.set(
        'Content-Disposition',
        `attachment; filename="crt-export_${timestamp}.ejson"`
    );
    context.body = ejson.stringify(out);

    await next();
}

var gatherHelperSetIds = (crtRecords) => {
    var idsByString = {};
    for (var record of crtRecords) {
        for (var field of getAllFields(record.state.settings)) {
            if (!HELPER_SET_FIELD_TYPES.includes(field.type)) {
                continue;
            }
            var setId = field.props?.setId;
            if (setId) {
                idsByString[String(setId)] = setId;
            }
        }
    }
    return Object.values(idsByString);
}

var getAllFields = (settings = {}) => {
    var { fields = [], subChannelFields = {} } = settings;
    return [
        ...fields,
        ...Object.values(subChannelFields).flat()
    ];
}

module.exports = exportEndpoint;
