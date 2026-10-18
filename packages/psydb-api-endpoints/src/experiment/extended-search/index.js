'use strict';
var debug = require('../debug-helper')('extendedSearch');

var { convertPointerToPath, compareIds } = require('@mpieva/psydb-core-utils');
var { SmartArray, SRTSettings } = require('@mpieva/psydb-common-lib');
var { SystemPermissionStages } = require('@mpieva/psydb-mongo-stages');
var {
    ObjectId,
    aggregateToArray,
    aggregateCount
} = require('@mpieva/psydb-mongo-adapter');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var BodySchema = require('./body-schema');

// NOTE: experiments have no custom record types
// so this does not use extendedSearch.core(); subjectData
// is intentionally not unwound, one row per experiment
var experimentExtendedSearch = async (context, next) => {
    var { db, permissions, request, i18n } = context;

    if (!permissions.hasFlag('canUseExtendedSearch')) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body
    });

    var {
        specialFilters,
        timezone,

        columns,
        sort = {},
        offset = 0,
        limit = 0
    } = request.body;

    var displayFieldData = (
        SRTSettings({ collection: 'experiment' }).allStaticFields()
        .filter(it => (
            permissions.isRoot() || it.pointer !== '/_id'
        ))
    );
    var availablePointers = displayFieldData.map(it => it.pointer);
    columns = columns.filter(it => availablePointers.includes(it));

    var readableStudyIds = await fetchReadableStudyIds({ db, permissions });
    var subjectHistoryExperimentIds = await fetchSubjectHistoryExperimentIds({
        db, subjectIds: specialFilters.subjectIds
    });

    var mainStages = SmartArray([
        ( readableStudyIds && { $match: {
            'state.studyId': { $in: readableStudyIds }
        }}),
        { $match: (
            extendedSearch.experiment.createSpecialFilterConditions(
                specialFilters, { timezone, subjectHistoryExperimentIds }
            ) || {}
        )},
        ( columns.includes('/state/selectedSubjectIds') && (
            OnlyParticipatedSubjectsWhenPostprocessedStage()
        )),
        { $project: {
            type: true,
            // NOTE: always needed by the ui for row coloring
            'state.isCanceled': true,
            'state.isPostprocessed': true,
            ...columns.reduce((acc, pointer) => ({
                ...acc,
                [ convertPointerToPath(pointer) ]: true
            }), {}),
        }},
    ]);

    debug('counting records');
    var recordsCount = await aggregateCount({
        db, experiment: mainStages,
        mongoSettings: { allowDiskUse: true }
    }) || 0;

    debug('searching records');
    var records = await aggregateToArray({
        db, experiment: SmartArray([
            ...mainStages,
            ( availablePointers.includes(sort.column) && SortStage(sort) ),
            { $skip: offset },
            ( limit && { $limit: limit }),
        ]),
        mongoSettings: { allowDiskUse: true }
    });

    if (columns.includes('/state/selectedSubjectIds')) {
        await addCanceledExperimentSubjects({ db, records });
    }

    var related = await fetchRelatedLabelsForMany({
        db, collectionName: 'experiment', records, i18n
    });

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

var fetchReadableStudyIds = async (bag) => {
    var { db, permissions } = bag;

    var stages = SystemPermissionStages({ collection: 'study', permissions });
    if (stages.length < 1) {
        return undefined; // NOTE: root has no restrictions
    }

    var studies = await aggregateToArray({ db, study: [
        ...stages,
        { $project: { _id: true }}
    ]});

    return studies.map(it => it._id);
}

// NOTE: canceled experiments dont have their subjects anymore
// so we need to look them up in the subjects participation history
var fetchSubjectHistoryExperimentIds = async (bag) => {
    var { db, subjectIds } = bag;

    if (!subjectIds || subjectIds.length < 1) {
        return undefined;
    }

    var path = 'scientific.state.internals.participatedInStudies';
    var subjects = await db.collection('subject').find(
        { _id: { $in: subjectIds.map(ObjectId) }},
        { projection: { [path]: true }}
    ).toArray();

    return subjects.flatMap(it => (
        (it.scientific?.state?.internals?.participatedInStudies || [])
        .map(p => p.experimentId)
        .filter(it => !!it)
    ));
}

// NOTE: once postprocessed we only want to show the subjects
// that actually participated, not everyone that was selected
var OnlyParticipatedSubjectsWhenPostprocessedStage = () => ({ $addFields: {
    'state.selectedSubjectIds': { $cond: {
        if: { $eq: [ '$state.isPostprocessed', true ] },
        then: { $map: {
            input: { $filter: {
                input: { $ifNull: [ '$state.subjectData', [] ]},
                cond: { $eq: [
                    '$$this.participationStatus', 'participated'
                ]}
            }},
            in: '$$this.subjectId'
        }},
        else: '$state.selectedSubjectIds'
    }}
}});

// NOTE: when an experiment gets canceled its subjects are pulled
// from the experiment record; the only trace left is the
// participatedInStudies entry on the subject itself
var addCanceledExperimentSubjects = async (bag) => {
    var { db, records } = bag;

    var canceledRecords = records.filter(it => it.state.isCanceled);
    if (canceledRecords.length < 1) {
        return;
    }

    var path = 'scientific.state.internals.participatedInStudies';
    var subjects = await db.collection('subject').find(
        { [`${path}.experimentId`]: { $in: canceledRecords.map(it => it._id) }},
        { projection: { [path]: true }}
    ).toArray();

    for (var record of canceledRecords) {
        record.state.selectedSubjectIds = (
            subjects.filter(subject => (
                subject.scientific.state.internals.participatedInStudies
                .some(it => compareIds(it.experimentId, record._id))
            ))
            .map(it => it._id)
        );
    }
}

var SortStage = (options) => {
    var { column, direction = 'asc' } = options;
    var path = convertPointerToPath(column);
    return { $sort: {
        [path]: direction === 'desc' ? -1 : 1,
        // NOTE: stable pagination when values are equal
        ...(path !== '_id' && { _id: 1 }),
    }}
}

module.exports = experimentExtendedSearch;
