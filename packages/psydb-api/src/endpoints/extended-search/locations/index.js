'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extended-search:studies'
);

var { ejson, keyBy, groupBy } = require('@mpieva/psydb-core-utils');
var { copy } = require('copy-anything');
var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var locationExtendedSearch = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

    var precheckBody = copy(request.body);
    validateOrThrow({
        schema: RequestBodySchema.Core(),
        payload: precheckBody
    });

    var {
        locationType
    } = precheckBody;

    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'location', recordType: locationType,
    });

    validateOrThrow({
        schema: RequestBodySchema.Full(crtSettings),
        payload: request.body
    });

    var {
        customFilters,
        specialFilters,

        columns,
        sort,
        offset = 0,
        limit = 0
    } = request.body;

    var {
        records,
        recordsCount,
        related,
        displayFieldData,
    } = await extendedSearch.core({
        db,
        permissions,
        collection: 'location',
        recordType: locationType,

        columns,
        sort,
        offset,
        limit,

        customFilters,
        specialFilterConditions: (
            extendedSearch.location.createSpecialFilterConditions(specialFilters)
        ),
    });

    var _specialStudyReverseRefs = await fetchSpecialStudyReverseRefs({
        db,
        locationType,
        locationRecords: records,
    });

    records = records.map(it => ({
        ...it,
        _specialStudyReverseRefs: _specialStudyReverseRefs[it._id]
    }));

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData,
        },
    });

    await next();
}

var fetchSpecialStudyReverseRefs = async (bag) => {
    var { db, locationType, locationRecords } = bag;

    var settings = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                'state.locations': { $exists: true }
            }},
            { $unwind: '$state.locations' },
            { $match: {
                'state.locations.locationId': { $in: locationRecords.map(it => it._id) }
            }},
            { $project: {
                'studyId': true,
                'state.locations.locationId': true
            }},
        ]).toArray()
    );

    var studies = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: settings.map(it => it.studyId) },
                'state.systemPermissions.isHidden': { $ne: true },
            }},
            { $project: {
                'type': true,
                'state.shorthand': true
            }}
        ]).toArray()
    );

    var studyLabelsById = keyBy({
        items: studies,
        byProp: '_id',
    });

    var grouped = groupBy({
        items: settings.filter(it => !!studyLabelsById[it.studyId]),
        byPointer: '/state/locations/locationId',
        transform: it => studyLabelsById[it.studyId]
    });

    return grouped;
}

module.exports = locationExtendedSearch;

