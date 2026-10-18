'use strict';
var debug = require('../debug-helper')('extendedSearch');

var {
    convertPointerToPath,
    keyBy,
    merge,
    unique,
} = require('@mpieva/psydb-core-utils');
var {
    SmartArray,
    SRTSettings,
    calculateAge,
} = require('@mpieva/psydb-common-lib');
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
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var BodySchema = require('./body-schema');

// NOTE: experiments have no custom record types
// so this does not use extendedSearch.core(); the experiments
// subjects are unwound, i.e. one row per subject
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
        subjectType,
        timezone,

        columns,
        sort = {},
        offset = 0,
        limit = 0
    } = request.body;

    var displayFieldData = [
        ...(
            SRTSettings({ collection: 'experiment' }).allStaticFields()
            .filter(it => (
                (permissions.isRoot() || it.pointer !== '/_id')
                && it.pointer !== '/state/isCanceled'
                && it.pointer !== '/state/interval/end'
                && it.pointer !== '/state/experimentOperatorTeamId'
            ))
            .map(it => ({
                ...it,
                ...displayNameOverrides[it.pointer]
            }))
        ),
        ParticipationStatusDisplayField(),
    ];
    var availablePointers = displayFieldData.map(it => it.pointer);

    var {
        subjectDisplayFieldData,
        dateOfBirthPointer,
    } = await gatherSubjectDisplayFieldData({
        db, permissions, subjectType
    });
    var availableSubjectPointers = subjectDisplayFieldData.map(it => (
        it.pointer
    ));

    var subjectColumns = columns.filter(it => (
        availableSubjectPointers.includes(it)
    ));
    columns = columns.filter(it => availablePointers.includes(it));
    var withTestingAge = subjectColumns.includes(TESTING_AGE_POINTER);

    var readableStudyIds = await fetchReadableStudyIds({ db, permissions });

    var { subjectIds } = specialFilters;
    var mainStages = SmartArray([
        // NOTE: canceled and upcoming experiments are
        // intentionally not searchable
        { $match: {
            'state.isCanceled': { $ne: true },
            'state.interval.start': { $lt: new Date() },
        }},
        ( readableStudyIds && { $match: {
            'state.studyId': { $in: readableStudyIds }
        }}),
        { $match: (
            extendedSearch.experiment.createSpecialFilterConditions(
                specialFilters, { timezone }
            ) || {}
        )},
        SubjectRowsStage(),
        // NOTE: one row per subject; experiments without
        // subjects are kept as a single row
        { $unwind: {
            path: '$_subjectRows',
            preserveNullAndEmptyArrays: true
        }},
        ( subjectIds?.length > 0 && { $match: {
            '_subjectRows.subjectId': { $in: subjectIds.map(ObjectId) }
        }}),
        // NOTE: keeping it an array so that it still matches
        // the experiment schema for labels and display
        { $addFields: {
            'state.selectedSubjectIds': { $cond: {
                if: { $ifNull: [ '$_subjectRows.subjectId', false ]},
                then: [ '$_subjectRows.subjectId' ],
                else: []
            }},
            '_participationStatus': '$_subjectRows.participationStatus',
        }},
        { $project: {
            type: true,
            // NOTE: always needed by the ui for row coloring
            'state.isPostprocessed': true,
            // NOTE: needed for stable sorting of unwound rows
            'state.selectedSubjectIds': true,
            ...(withTestingAge && { 'state.interval.start': true }),
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

    var related = await fetchRelatedLabelsForMany({
        db, collectionName: 'experiment', records, i18n
    });

    if (subjectColumns.length > 0) {
        var subjectRelated = await addSubjectColumnData({
            db, permissions, i18n, subjectType, subjectColumns, records,
            dateOfBirthPointer,
        });
        related = merge(related, subjectRelated);
    }

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData: [
                ...displayFieldData,
                ...subjectDisplayFieldData,
            ],
        },
    });

    await next();
}

var displayNameOverrides = {
    // NOTE: subjects are unwound so its one subject per row
    '/state/selectedSubjectIds': {
        displayName: 'Subject',
        displayNameI18N: { de: 'Proband:in' },
    },
    '/state/interval/start': {
        displayName: 'Date/Time',
        displayNameI18N: { de: 'Zeitpunkt' },
    },
};

// NOTE: subject columns are prefixed with SUBJECT_PREFIX
// the subject record is attached to each row under that key
var SUBJECT_PREFIX = '/_subject';

// NOTE: virtual column; age of the subject at the experiment start
var TESTING_AGE_POINTER = `${SUBJECT_PREFIX}/_testingAge`;
var TestingAgeDisplayField = () => ({
    key: '_testingAge',
    systemType: 'SaneString',
    type: 'SaneString',
    props: {},
    pointer: TESTING_AGE_POINTER,
    dataPointer: TESTING_AGE_POINTER,
    displayName: 'T-Age',
    displayNameI18N: { de: 'T-Alter' },
});

var gatherSubjectDisplayFieldData = async (bag) => {
    var { db, permissions, subjectType } = bag;
    if (!subjectType) {
        return { subjectDisplayFieldData: [] };
    }

    var crt = await fetchOneCustomRecordType({
        db, collection: 'subject', type: subjectType
    });
    var { availableDisplayFieldData } = await (
        gatherDisplayFieldsForRecordType({
            db, prefetched: crt, target: 'table', permissions
        })
    );

    var { commentFieldIsSensitive } = crt.state;
    var canAccessSensitive = permissions.hasFlag('canAccessSensitiveFields');

    var available = availableDisplayFieldData.filter(it => (
        it.pointer && !it.isRemoved
        && !(
            it.pointer === '/scientific/state/comment'
            && commentFieldIsSensitive && !canAccessSensitive
        )
    ));
    // NOTE: sensitive fields are already filtered out
    var dateOfBirthField = available.find(it => (
        it.props?.isSpecialAgeFrameField
    ));

    var subjectDisplayFieldData = [
        ...available.map(it => ({
            ...it,
            pointer: SUBJECT_PREFIX + it.pointer,
            ...(it.dataPointer && {
                dataPointer: SUBJECT_PREFIX + it.dataPointer
            }),
        })),
        ...(dateOfBirthField ? [ TestingAgeDisplayField() ] : []),
    ];

    return {
        subjectDisplayFieldData,
        dateOfBirthPointer: dateOfBirthField?.pointer,
    };
}

// NOTE: this is done after pagination so we only fetch
// subjects for the current page; subjects of other types
// or subjects that cannot be read are left empty
var addSubjectColumnData = async (bag) => {
    var {
        db, permissions, i18n,
        subjectType, subjectColumns, records,
        dateOfBirthPointer,
    } = bag;

    var withTestingAge = (
        dateOfBirthPointer && subjectColumns.includes(TESTING_AGE_POINTER)
    );

    var subjectIds = unique(
        records
        .map(it => it.state.selectedSubjectIds?.[0])
        .filter(it => !!it)
        .map(String)
    ).map(ObjectId);

    var permissionPath = (
        'scientific.state.systemPermissions'
        + '.accessRightsByResearchGroup.researchGroupId'
    );
    var subjects = await aggregateToArray({ db, subject: SmartArray([
        { $match: {
            _id: { $in: subjectIds },
            type: subjectType,
            ...(!permissions.isRoot() && {
                [permissionPath]: { $in: (
                    permissions.getCollectionFlagIds('subject', 'read')
                )}
            })
        }},
        { $project: {
            type: true,
            ...(
                subjectColumns
                .filter(it => it !== TESTING_AGE_POINTER)
                .reduce((acc, pointer) => ({
                    ...acc,
                    [ convertPointerToPath(
                        pointer.slice(SUBJECT_PREFIX.length)
                    ) ]: true
                }), {})
            ),
            // NOTE: seperate key so that we dont send the date of birth
            // when its column is not selected
            ...(withTestingAge && {
                _dateOfBirth: '$' + convertPointerToPath(dateOfBirthPointer)
            }),
        }},
    ])});

    var subjectsById = keyBy({ items: subjects, byProp: '_id' });
    var key = SUBJECT_PREFIX.slice(1);
    for (var it of records) {
        var subjectId = it.state.selectedSubjectIds?.[0];
        var subject = subjectId && subjectsById[subjectId];
        if (subject) {
            var { _dateOfBirth, ...pass } = subject;
            var start = it.state.interval?.start;
            it[key] = {
                ...pass,
                ...(withTestingAge && _dateOfBirth && start && {
                    _testingAge: calculateAge({
                        base: _dateOfBirth, relativeTo: start
                    })
                }),
            };
        }
    }

    if (subjects.length < 1) {
        return {};
    }
    return await fetchRelatedLabelsForMany({
        db, collectionName: 'subject', records: subjects, i18n
    });
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

// NOTE: one entry per subject incl. their participation status;
// subjectData is in sync with selectedSubjectIds
var SubjectRowsStage = () => ({ $addFields: {
    '_subjectRows': { $map: {
        input: { $ifNull: [ '$state.subjectData', [] ]},
        in: {
            subjectId: '$$this.subjectId',
            participationStatus: '$$this.participationStatus',
        }
    }}
}});

// NOTE: virtual column that is filled from the unwound subject rows
var ParticipationStatusDisplayField = () => ({
    key: '_participationStatus',
    systemType: 'ParticipationStatus',
    type: 'ParticipationStatus',
    props: {},
    pointer: '/_participationStatus',
    dataPointer: '/_participationStatus',
    displayName: 'Status',
    displayNameI18N: { de: 'Status' },
});

var SortStage = (options) => {
    var { column, direction = 'asc' } = options;
    var path = convertPointerToPath(column);
    return { $sort: {
        [path]: direction === 'desc' ? -1 : 1,
        // NOTE: stable pagination when values are equal
        ...(path !== '_id' && { _id: 1 }),
        ...(path !== 'state.selectedSubjectIds' && {
            'state.selectedSubjectIds': 1
        }),
    }}
}

module.exports = experimentExtendedSearch;
