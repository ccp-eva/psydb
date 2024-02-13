'use strict';
var {
    arrify,
    entries,
    maybeIntersect,
    forcePush,
    compareIds,
    unique,
    keyBy,
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow,
    aggregateToArray,
    createRecordLabel,
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

    var {
        filters = {},
        projectedFields = [
            'labMethods',
            'studyTypes',
            'subjectTypes',
            'locationTypes'
        ],

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

    var MATCH = { _id: { $in: researchGroupIds }};
    for (var [key, values] of entries(otherFilters)) {
        var path = (
            key === 'labMethods'
            ? `state.${key}`
            : `state.${key}.key`
        )
        MATCH[path] = { $in: values };
    }

    var PROJECT = {
        researchGroupIds: '$_id',
        _recordLabelDefinitionFields: true,
    };
    for (var it of projectedFields) {
        PROJECT[it] = (
            it === 'labMethods'
            ? `$state.${it}`
            : `$state.${it}.key`
        );
    }

    var records = await withRetracedErrors(
        aggregateToArray({ db, researchGroup: [
            { $match: MATCH },
            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition
            }),
            { $project: PROJECT }
        ]})
    );

    var relatedRecords = {};
    var allTypes = [];
    var merged = {};
    for (var it of records) {
        
        relatedRecords[it._id] = {
            _id: it._id,
            _recordLabel: createRecordLabel({
                definition: recordLabelDefinition,
                record: it._recordLabelDefinitionFields,
                ...clientI18N
            })
        }
        delete it._recordLabelDefinitionFields

        for (var key of ['researchGroupIds', 'labMethods']) {
            var value = it[key];
            if (!value) {
                continue;
            }
            forcePush({
                into: merged, pointer: `/${key}`,
                values: [ value ]
            })
        }

        for (var key of ['studyTypes', 'subjectTypes', 'locationTypes']) {
            var values = it[key];
            if (!values) {
                continue;
            }
            forcePush({
                into: merged, pointer: `/${key}`,
                values
            })
            allTypes.push(...values);
        }
    }
    for (var [key, values] of entries(merged)) {
        merged[key] = unique({ from: values, transformOption: String })
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
    )

    context.body = ResponseBody({
        data: {
            ...(includeRecords && { records }),
            ...(includeMerged && { merged }),
            related: {
                records: relatedRecords,
                crts: keyBy({ items: crtRecords, byProp: 'type' })
            }
        }
    });

    await next();
}

module.exports = { searchMetadata }
