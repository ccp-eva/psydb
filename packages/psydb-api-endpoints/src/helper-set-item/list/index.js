'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { translationExists } = require('@mpieva/psydb-i18n');
var { SmartArray } = require('@mpieva/psydb-common-lib');
var {
    aggregateToArray,
    aggregateCount
} = require('@mpieva/psydb-mongo-adapter');

var {
    SearchBaseStages,
    PaginationStages,
    StripRohrpostMetadataStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    convertFiltersToQueryPairs, 
    getMongoCollation,
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema({
            availableQuickSearchFields: displayFields
        }),
        payload: request.body,
        unmarshalClientTimezone: timezone,
    });

    var { isRoot, availableHelperSetIds = [] } = permissions;
    

    var {
        target,
        //searchOptions = {},
        filters,
        extraIds = [], // TODO
        excludedIds = [],
        constraints = {},
        showHidden = false,
        offset,
        limit,
    } = request.body;

    var definedQuickSearch = convertFiltersToQueryPairs({
        filters, displayFields,
    });
    
    var mongoSettings = {
        allowDiskUse: true,
        collation: getMongoCollation({ language }),
    };
    
    var baseStages = SmartArray([
        // XXX: that should be here but wasnt in old version
        //( !isRoot() && { $match: {
        //    setId: { $in: availableHelperSetIds }
        //}}),
        ...SearchBaseStages({
            definedQuickSearch,

            constraints,
            //onlyIds,
            excludedIds,
            showHidden
        })
    ]);

    var totalRecordCount = await aggregateCount({
        db, helperSetItem: baseStages, mongoSettings
    });
    
    var searchStages = SmartArray([
        // FIXME: ghetto
        { $addFields: {
            _translatedLabel: { $ifNull: [
                `$state.displayNameI18N.${language}`,
                '$state.label'
            ]},
        }},
        ...baseStages,
        StripRohrpostMetadataStage(),
        SortStage({ language }),
        PaginationStages({ limit, offset }),
    ], { spreadArrayItems: true });
    
    var records = await aggregateToArray({
        db, helperSetItem: searchStages, mongoSettings
    });

    // FIXME: ghetto
    displayFields = displayFields.filter(it => (
        target === 'optionlist'
        ? it.key === '_label'
        : it.key !== '_label'
    ));

    context.body = ResponseBody({
        data: {
            displayFieldData: displayFields,
            records,
            recordsCount: totalRecordCount,

            related: {}
        },
    });

    await next();
}

var SortStage = (bag = {}) => {
    var { language } = bag;

    var sortPath = (
        translationExists({ language })
        ? `state.displayNameI18N.${language}`
        : 'state.label'
    );
    
    return (
        { $sort: { [sortPath]: 1 }}
    )
}

var displayFields = [
    {
        key: '_label',
        pointer: '/_translatedLabel',
        dataPointer: '/_translatedLabel',
        
        systemType: 'SaneString',
        displayName: 'Label',
        displayNameI18N: { de: 'Bezeichnung' },
    },
    {
        key: `_labelEN`,
        systemType: 'SaneString',
        pointer: '/state/label',
        
        displayName: `Label (EN)`,
        displayNameI18N: { de: `Bezeichnung (EN)` },
    },
    {
        key: `_labelDE`,
        systemType: 'SaneString',
        pointer: '/state/displayNameI18N/de',
        
        displayName: `Label (DE)`,
        displayNameI18N: { de: `Bezeichnung (DE)` },
    },
]

module.exports = listEndpoint;
