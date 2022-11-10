'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:subjects'
);

var jsonpointer = require('jsonpointer');
var { copy } = require('copy-anything');
var { groupBy, convertPointerToPath } = require('@mpieva/psydb-core-utils');
var {
    calculateAge,
    findCRTAgeFrameField
} = require('@mpieva/psydb-common-lib');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,

    fetchRelatedLabelsForMany
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
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

    var dobFieldPointer = findCRTAgeFrameField(crtSettings);

    var {
        customGdprFilters,
        customScientificFilters,
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
        collection: 'subject',
        recordType: subjectType,

        columns,
        sort,
        offset,
        limit,

        customScientificFilters,
        customGdprFilters,
        specialFilterConditions: (
            extendedSearch.location.createSpecialFilterConditions(specialFilters)
        ),
        specialFilterProjection: {
            ...(columns.includes('/_specialStudyParticipation') && {
                'scientific.state.internals.participatedInStudies': true
            }),
            ...(dobFieldPointer && columns.includes('/_specialAgeToday') && {
                [convertPointerToPath(dobFieldPointer)]: true
            }),
        }
    });

    var now = new Date();
    if (dobFieldPointer && columns.includes('/_specialAgeToday')) {
        records = records.map(it => {
            return { ...it, _specialAgeToday: calculateAge({
                base: jsonpointer.get(it, dobFieldPointer),
                relativeTo: now,
                asString: true,
            }) }
        })
    }

    var experiments = (
        await fetchUpcomingExperiments({ db, records })
    );
    var upcomingExperimentsForSubject = groupBy({
        items: experiments,
        byPointer: '/state/subjectId',
    });

    //console.log({ upcomingExperimentsForSubject });

    records = records.map(it => ({
        ...it,
        _specialUpcomingExperiments: upcomingExperimentsForSubject[it._id] || [],
    }));

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData,
        },
    });
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

