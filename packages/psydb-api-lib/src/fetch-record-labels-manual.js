'use strict';
var { entries, groupBy } = require('@mpieva/psydb-core-utils');
var stringifiers = require('@mpieva/psydb-common-lib/src/field-stringifiers');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var aggregateToArray = require('./aggregate-to-array');
var fetchAllCRTSettings = require('./fetch-all-crt-settings');
var createRecordLabel = require('./create-record-label');
var mergeRecordLabelProjections = require('./merge-record-label-projections');

var fetchRecordLabelsManual = async (db, idsForCollection, options = {}) => {
    var { timezone } = options;

    var collections = groupBy({
        items: Object.keys(idsForCollection),
        createKey: (c) => (
            allSchemaCreators[c].hasCustomTypes ? 'withCRT' : 'noCRT'
        )
    });

    var sharedBag = { db, idsForCollection, options };
    
    var relatedNoCRT = (
        collections.noCRT?.length > 0
        ? await handleNoCRT({
            collections: collections.noCRT,
            ...sharedBag
        })
        : undefined
    );
    var relatedWithCRT = (
        collections.withCRT?.length > 0
        ? await handleWithCRT({
            collections: collections.withCRT,
            ...sharedBag
        })
        : undefined
    );

    var related = {
        ...relatedNoCRT,
        ...relatedWithCRT
    }

    return related;
}

var handleNoCRT = async (bag) => {
    var { db, collections, idsForCollection, options } = bag;
    var { timezone } = options;

    var related = {};
    for (var collection of collections) {
        var ids = idsForCollection[collection];
        
        var fallback = [
            undefined,
            { format: '${#}', tokens: [ '/_id' ] }
        ];
        
        var [ projection, definition ] = {
            'personnel': [
                { 
                    'gdpr.state.firstname': true,
                    'gdpr.state.lastname': true,
                },
                { format: '${#} ${#}', tokens: [
                    { dataPointer: '/gdpr/state/firstname' },
                    { dataPointer: '/gdpr/state/lastname' },
                ]}
            ],
            'experiment': [
                { 
                    '__type': { $ifNull: [ '$realType', '$type'] },
                    'state.interval.start': true,
                },
                { format: '${#} ${#}', tokens: [
                    { dataPointer: '/__type' },
                    {
                        systemType: 'DateTime',
                        dataPointer: '/state/interval/start',
                    },
                ]}
            ]
        }[collection] || fallback;

        var records = await aggregateToArray({ db, [collection]: [
            { $match: { _id: { $in: ids } }},
            { $project: {
                _id: true,
                ...projection
            }}
        ]})
        
        related[collection] = {}
        for (var record of records) {
            related[collection][record._id] = createRecordLabel({
                record,
                definition,
                timezone
            })
        }
    }

    return related;
}

var handleWithCRT = async (bag) => {
    var { db, collections, idsForCollection, options } = bag;
    var { timezone } = options;

    var allCRTSettings = await fetchAllCRTSettings(db, [
        ...collections.map(
            (collection) => ({ collection })
        )
    ], { wrap: true });

    var related = {};
    for (var collection of collections) {
        var ids = idsForCollection[collection];

        var recordLabelProjection = mergeRecordLabelProjections(
            allCRTSettings[collection], { as: '_labelProjection' }
        );

        var records = await (
            db.collection(collection)
            .aggregate([
                { $match: { _id: { $in: ids } }},
                { $project: {
                    _id: true, type: true,
                    ...recordLabelProjection
                }}
            ])
            .toArray()
        );

        related[collection] = {}
        for (var record of records) {
            related[collection][record._id] = createRecordLabel({
                record,
                definition: (
                    allCRTSettings[collection][record.type]
                    .getRecordLabelDefinition()
                ),
                from: '_labelProjection',
                timezone
            })
        }
    }
    return related;
}

module.exports = fetchRecordLabelsManual;
