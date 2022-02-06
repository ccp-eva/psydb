'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:subjects'
);

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
    getCustomQueryPointer,
    convertPointerKeys
} = require('../utils');

var RequestBodySchema = require('./request-body-schema');

var subjectExtendedSearch = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

    validateOrThrow({
        schema: RequestBodySchema.Core(),
        payload: request.body
    });

    var {
        subjectType
    } = request.body;

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
            ...convertPointerKeys(customQueryValues),
        }},
        
        { $project: {
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
        db.collection('subject').aggregate(stages).toArray()
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

