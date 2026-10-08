'use strict';
var debug = require('../debug-helper')('extendedSearch');

var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { SmartArray, SRTSettings } = require('@mpieva/psydb-common-lib');
var { SystemPermissionStages } = require('@mpieva/psydb-mongo-stages');
var {
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

    var mainStages = SmartArray([
        ( readableStudyIds && { $match: {
            'state.studyId': { $in: readableStudyIds }
        }}),
        { $match: (
            extendedSearch.experiment.createSpecialFilterConditions(
                specialFilters, { timezone }
            ) || {}
        )},
        { $project: {
            type: true,
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
