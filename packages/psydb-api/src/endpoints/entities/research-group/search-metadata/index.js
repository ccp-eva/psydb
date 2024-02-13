'use strict';
var {
    arrify,
    entries,
    maybeIntersect,
    forcePush,
    compareIds,
    unique,
    keyBy,
    ejson,
    omit,
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow,
    aggregateOne,
    aggregateToArray,
    createRecordLabel,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var {
    SeperateRecordLabelDefinitionFieldsStage
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var Schema = require('./schema');


var searchMetadata = async (context, next) => {
    var { db, request, permissions, timezone, language, locale } = context;
    var clientI18N = { timezone, language, locale }; // NOTE: i18ncontext?

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var fieldKeys = [
        'labMethods',
        'studyTypes',
        'subjectTypes',
        'locationTypes'
    ]

    var {
        filters = {},
        projectedFields = fieldKeys,
        includeRecords = true,
        includeMerged = true,
    } = request.body;

    var { researchGroupIds, ...otherFilters } = filters;

    researchGroupIds = maybeIntersect({
        items: permissions.getResearchGroupIds(),
        withMaybe: researchGroupIds,
        compare: compareIds,
    });

    var { recordLabelDefinition } = allSchemaCreators.researchGroup;

    var UNWINDS = [];
    for (var it of fieldKeys) {
        UNWINDS.push({ $unwind: `$state.${it}`});
    }

    var MATCH = { _id: { $in: researchGroupIds }};
    for (var [key, values] of entries(otherFilters)) {
        var path = (
            key === 'labMethods'
            ? `state.${key}`
            : `state.${key}.key`
        )
        MATCH[path] = { $in: values };
    }

    var GROUP = {
        _id: null,
        researchGroupIds: { $addToSet: '$_id' }
    };
    for (var it of projectedFields) {
        var path = (
            it === 'labMethods'
            ? `$state.${it}`
            : `$state.${it}.key`
        )
        GROUP[it] = { $addToSet: path };
    }

    var stages = [
        ...UNWINDS,
        { $match: MATCH },
        { $group: GROUP },
        { $project: { _id: false }}
    ]

    var merged = await withRetracedErrors(
        aggregateOne({ db, researchGroup: stages })
    ) || {}; // NOTE: this can be undefined

    for (var it of [ 'researchGroupIds', ...projectedFields]) {
        if (!merged[it]) {
            merged[it] = []
        }
    }
    
    var relatedRecords  = await withRetracedErrors(
        fetchRecordLabelsManual(db, {
            researchGroup: merged.researchGroupIds
        }, { ...clientI18N, oldWrappedLabels: true })
    );

    var allTypes = [];
    for (var key of ['studyTypes', 'subjectTypes', 'locationTypes']) {
        allTypes.push(...(merged[key] || []));
    }

    var crtRecords = await withRetracedErrors(
        aggregateToArray({ db, customRecordType: [
            { $match: {
                'type': { $in: allTypes }
            }},
            { $project: {
                'type': true,
                'state.label': true,
                'state.displayNameI18N': true
            }}
        ]})
    );

    context.body = ResponseBody({
        data: {
            merged,
            related: {
                records: relatedRecords,
                crts: keyBy({ items: crtRecords, byProp: 'type' })
            }
        }
    });

    await next();
}

module.exports = { searchMetadata }
