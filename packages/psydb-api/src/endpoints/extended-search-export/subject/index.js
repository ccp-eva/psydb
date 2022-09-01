'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extended-search-export:studies'
);

var jsonpointer = require('jsonpointer');

var sift = require('sift');
var { copy } = require('copy-anything');
var { keyBy, groupBy } = require('@mpieva/psydb-core-utils');
var {
    stringifyFieldValue,
    fieldStringifiers
} = require('@mpieva/psydb-common-lib');

var {
    CSV,
    validateOrThrow,
    fetchCRTSettings,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var subjectExtendedSearchExport = async (context, next) => {
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

        timezone,
    } = request.body;

    var {
        records,
        recordsCount,
        related,
        displayFieldData,
    } = await extendedSearch.core({
        db,
        collection: 'subject',
        recordType: subjectType,

        columns,
        sort,
        customGdprFilters,
        customScientificFilters,

        specialFilterConditions: (
            extendedSearch.subject.createSpecialFilterConditions(specialFilters)
        ),
        specialFilterProjection: {
            ...(columns.includes('/_specialStudyParticipation') && {
                'scientific.state.internals.participatedInStudies': true
            }),
        }
    });

    var experiments = (
        await fetchUpcomingExperiments({ db, records })
    );
    var upcomingExperimentsForSubject = groupBy({
        items: experiments,
        byPointer: '/state/subjectId',
    });

    records = records.map(it => ({
        ...it,
        _specialUpcomingExperiments: upcomingExperimentsForSubject[it._id] || [],
    }));

    var columnDefinitions = keyBy({
        items: displayFieldData,
        byProp: 'dataPointer'
    });


    var csv = CSV();
    
    csv.addLine(columns.map(pointer => {
        var fieldDefinition = columnDefinitions[pointer];
        switch (pointer) {
            case '/_specialStudyParticipation':
                return 'Studien';
            case '/_specialUpcomingExperiments':
                return 'Termine';
            default:
                return fieldDefinition.displayName;
        }
    }));

    for (var record of records) {
        csv.addLine(columns.map(pointer => {
       
            switch (pointer) {
                case '/_specialStudyParticipation':
                    return formatStudyParticipation({
                        record, related, timezone
                    });
                    break;
                case '/_specialUpcomingExperiments':
                    return formatUpcomingExperiments({
                        record, related, timezone
                    });
                    break;
                default:
                    var fieldDefinition = columnDefinitions[pointer];
                    var { dataPointer } = fieldDefinition;
                    var rawValue = jsonpointer.get(record, dataPointer);
                    
                    var str = stringifyFieldValue({
                        rawValue,
                        fieldDefinition,
                        ...related,

                        timezone,
                    });

                    return str;
            }
        }))
    }

    //console.log(csv.toString());
    context.body = csv.toString();

    await next();
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

var formatStudyParticipation = (bag) => {
    var { record, related, timezone } = bag;
    
    var participation = (
        record.scientific.state.internals.participatedInStudies
    );

    var relatedStudies = related.relatedRecordLabels.study;
    var formatted = (
        participation
        .filter(it => it.status === 'participated')
        .map(it => {
            var studyLabel = relatedStudies[it.studyId]._recordLabel;
            var date = fieldStringifiers.DateOnlyServerSide(
                it.timestamp, { timezone }
            )
            return `${studyLabel} (${date})`;
        })
        .join('; ')
    );

    return formatted;
}

var formatUpcomingExperiments = (bag) => {
    var { record, related, timezone } = bag;
    var experiments = record._specialUpcomingExperiments;
    
    var formatted = (
        experiments
        .map((it, index) => {
            var date = fieldStringifiers.DateOnlyServerSide(
                it.state.interval.start, { timezone }
            )
            return `${it.state.studyLabel} (${date})`;
        })
        .join('; ')
    );

    return formatted;
}

module.exports = subjectExtendedSearchExport;

