'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extended-search-export:studies'
);

var { copy } = require('copy-anything');
var { __fixRelated, __fixDefinitions } = require('@mpieva/psydb-common-compat');

var {
    jsonpointer,
    keyBy,
    groupBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    findCRTAgeFrameField
} = require('@mpieva/psydb-common-lib');

var { Fields } = require('@mpieva/psydb-custom-fields-common');

var {
    CSV,
    validateOrThrow,
    fetchCRTSettings,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var subjectExtendedSearchExport = async (context, next) => {
    var { db, permissions, request, i18n } = context;

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
        customGdprFilters,
        customScientificFilters,

        specialFilterConditions: (
            extendedSearch.subject.createSpecialFilterConditions(specialFilters)
        ),
        specialFilterProjection: {
            ...((
                columns.includes('/_specialStudyParticipation')
                || columns.includes('/_specialHistoricExperimentLocations')
            ) && {
                'scientific.state.internals.participatedInStudies': true
            }),
            ...(dobFieldPointer && columns.includes('/_specialAgeToday') && {
                [convertPointerToPath(dobFieldPointer)]: true
            }),
        }
    });

    // FIXME
    related = __fixRelated(related, { isResponse: false });
    displayFieldData = __fixDefinitions(displayFieldData);

    var experiments = (
        await fetchUpcomingExperiments({ db, records })
    );
    var upcomingExperimentsForSubject = groupBy({
        items: experiments,
        byPointer: '/state/subjectId',
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

    records = records.map(it => ({
        ...it,
        _specialUpcomingExperiments: upcomingExperimentsForSubject[it._id] || [],
    }));

    var columnDefinitions = keyBy({
        items: displayFieldData,
        byProp: 'pointer'
    });


    var csv = CSV();
    
    csv.addLine(columns.map(pointer => {
        var fieldDefinition = columnDefinitions[pointer];
        switch (pointer) {
            case '/_specialAgeToday':
                return 'Alter';
            case '/_specialStudyParticipation':
                return 'Studien';
            case '/_specialUpcomingExperiments':
                return 'Termine';
            case '/_specialHistoricExperimentLocations':
                return 'Historische Termin-Locations';
            default:
                return fieldDefinition.displayName;
        }
    }));

    for (var record of records) {
        csv.addLine(columns.map(pointer => {
       
            switch (pointer) {
                case '/_specialAgeToday':
                    return record._specialAgeToday;
                    break;
                case '/_specialStudyParticipation':
                    return formatStudyParticipation({
                        record, related, i18n
                    });
                    break;
                case '/_specialHistoricExperimentLocations':
                    return formatHistoricExperimentLocations({
                        record, related, i18n
                    });
                    break;
                case '/_specialUpcomingExperiments':
                    return formatUpcomingExperiments({
                        record, related, i18n
                    });
                    break;
                default:
                    var definition = columnDefinitions[pointer];
                    var { systemType } = definition;

                    var stringify = Fields[systemType]?.stringifyValue;
                    var str = stringify ? (
                        stringify({ record, definition, related, i18n })
                    ) : '[!!ERROR!!]]';
                    
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
    
    // FIXME
    related = __fixRelated(related, { isResponse: false });

    records = records.map(it => ({
        ...it,
        state: {
            ...it.state,
            studyLabel: (
                related.records
                .study[it.state.studyId]._recordLabel
            )
        }
    }));

    return records;
}

var formatStudyParticipation = (bag) => {
    var { record, related, i18n } = bag;
    
    var participation = (
        record.scientific.state.internals.participatedInStudies
    );

    var relatedStudies = related.records.study;
    var formatted = (
        participation
        .filter(it => it.status === 'participated')
        .map(it => {
            var studyLabel = relatedStudies[it.studyId]._recordLabel;
            var date = Fields.DateOnlyServerSide.stringifyValue({
                value: it.timestamp, i18n
            });
            return `${studyLabel} (${date})`;
        })
        .join('; ')
    );

    return formatted;
}

var formatHistoricExperimentLocations = (bag) => {
    var { record, related, i18n } = bag;
    
    var participation = (
        record.scientific.state.internals.participatedInStudies
    );

    var relatedLocations = related.records.location;
    var formatted = (
        participation
        .filter(it => it.status === 'participated')
        .map(it => {
            var locationLabel = relatedLocations[it.locationId]._recordLabel;
            var date = Fields.DateOnlyServerSide.stringifyValue({
                value: it.timestamp, i18n
            });
            return `${locationLabel} (${date})`;
        })
        .join('; ')
    );

    return formatted;
}

var formatUpcomingExperiments = (bag) => {
    var { record, i18n } = bag;
    var experiments = record._specialUpcomingExperiments;
    
    var formatted = (
        experiments
        .map((it, index) => {
            var date = Fields.DateOnlyServerSide.stringifyValue({
                value: it.state.interval.start, i18n
            });
            return `${it.state.studyLabel} (${date})`;
        })
        .join('; ')
    );

    return formatted;
}

module.exports = subjectExtendedSearchExport;

