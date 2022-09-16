'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:subjects'
);

var sift = require('sift');
var { copy } = require('copy-anything');
var { groupBy } = require('@mpieva/psydb-core-utils');

var {
    ResponseBody,
    validateOrThrow,
    fromFacets,

    fetchOneCustomRecordType,
    convertPointerToPath,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,

    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');


var {
    createCustomQueryValues,
    convertPointerKeys,
    createSpecialFilterConditions,
} = require('../utils');

var RequestBodySchema = require('./request-body-schema');

var subjectExtendedSearch = async (context, next) => {
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
        subjectType
    } = precheckBody;

    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType,
    });

    validateOrThrow({
        schema: RequestBodySchema.Full(crtSettings),
        payload: request.body
    });

    var {
        customGdprFilters,
        customScientificFilters,
        specialFilters,

        columns,
        sort,
        offset = 0,
        limit = 0
    } = request.body;

    var crt = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectType
    });

    var {
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'subject',
        customRecordType: subjectType,
        target: 'table',
    });
    // FIXME: generalzie the creation of the field parts
    // see extended search columns
    var addressFields = availableDisplayFieldData.filter(
        sift({ type: 'Address' })
    );
    if (addressFields.length > 0) {
        for (var it of addressFields) {
            var block = [
                {
                    key: it.key + '.city',
                    type: 'SaneString',
                    displayName: `Ort (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/city',
                    dataPointer: it.dataPointer + '/city',
                },
                {
                    key: it.key + '.postcode',
                    type: 'SaneString',
                    displayName: `PLZ (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/postcode',
                    dataPointer: it.dataPointer + '/postcode',
                },
                {
                    key: it.key + '.street',
                    type: 'SaneString',
                    displayName: `Straße (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/street',
                    dataPointer: it.dataPointer + '/street',
                },
                {
                    key: it.key + '.housenumber',
                    type: 'SaneString',
                    displayName: `Nummer (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/housenumber',
                    dataPointer: it.dataPointer + '/housenumber',
                },
                {
                    key: it.key + '.affix',
                    type: 'SaneString',
                    displayName: `Zusatz (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/affix',
                    dataPointer: it.dataPointer + '/affix',
                }
            ];

            availableDisplayFieldData.push(...block);
        }
    }

    var { subChannelFields } = crt.state.settings;

    var customFields = {
        scientific: (
            subChannelFields.scientific.filter(it => !it.isRemoved)
        ),
        gdpr: (
            subChannelFields.gdpr.filter(it => !it.isRemoved)
        )
    };

    var customQueryValues = {
        ...createCustomQueryValues({
            fields: customFields.scientific,
            filters: customScientificFilters,
        }),
        ...createCustomQueryValues({
            fields: customFields.gdpr,
            filters: customGdprFilters,
        }),
    }

    //console.dir(customQueryValues, { depth: null })


    var stages = [
        { $match: {
            isDummy: { $ne: true },
            'scientific.state.internals.isRemoved': { $ne: true },

            ...convertPointerKeys(customQueryValues),
            ...createSpecialFilterConditions(specialFilters),
        }},
        
        { $project: {
            sequenceNumber: true,
            type: true,
            ...columns.reduce((acc, pointer) => ({
                ...acc,
                [ convertPointerToPath(pointer) ]: true
            }), {}),
            ...(columns.includes('/_specialStudyParticipation') && {
                'scientific.state.internals.participatedInStudies': true
            }),
        }},

        SortStage({ ...sort }),

        { $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ].filter(it => !!it);

    //console.dir({ stages }, { depth: null });

    var facets = await (
        db.collection('subject').aggregate(
            stages,
            {
                allowDiskUse: true,
                collation: { locale: 'de@collation=phonebook' }
            }
        ).toArray()
    );
    
    var [ records, recordsCount ] = fromFacets(facets);

    var experiments = (
        await fetchUpcomingExperiments({ db, records })
    );
    var upcomingExperimentsForSubject = groupBy({
        items: experiments,
        byPointer: '/state/subjectId',
    });

    //console.log({ upcomingExperimentsForSubject });

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectType,
        records: records,
    });

    records = records.map(it => ({
        ...it,
        _specialUpcomingExperiments: upcomingExperimentsForSubject[it._id] || [],
    }));

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData: availableDisplayFieldData,
        },
    });
}

var SortStage = (options) => {
    var { column, direction = 'asc' } = options;
    if (!column) {
        return undefined;
    }
    var path = convertPointerToPath(column);
    return { $sort: {
        [path]: direction === 'desc' ? -1 : 1,
    }}

}

var fetchUpcomingExperiments = async ({ db, records }) => {
    var now = new Date();

    var records = await (
        db.collection('experiment').aggregate([
            { $match: {
                'state.isPostprocessed': false,
                'state.isCanceled': false,
            }},
            { $sort: { 'state.interval.start': 1 }},
            { $unwind: '$state.subjectData' },
            { $project: {
                'type': true,
                'state.subjectId': '$state.subjectData.subjectId',
                'state.interval': true,
                'state.studyId': true,
            }},
        ]).toArray()
    );
    
    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records,
    });

    records = records.map(it => ({
        ...it,
        state: {
            ...it.state,
            studyLabel: (
                related.relatedRecordLabels
                .study[it.state.studyId]._recordLabel
            )
        }
    }));

    return records;
}

module.exports = subjectExtendedSearch;

