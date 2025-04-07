'use strict';
var debug = require('debug')('psydb:api:endpoints:helperSetItem:search');

var { entries } = require('@mpieva/psydb-core-utils');
var { translationExists } = require('@mpieva/psydb-i18n');
var { SmartArray } = require('@mpieva/psydb-common-lib');

var {
    SearchBaseStages,
    PaginationStages,
    StripRohrpostMetadataStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    withRetracedErrors,

    convertFiltersToQueryPairs, 
    aggregateToArray,
    getMongoCollation,
} = require('@mpieva/psydb-api-lib');

var validate = require('./validate');
var verifyAllowedAndPlausible = require('./verify');

// NOTE https://github.com/ajv-validator/ajv/issues/242
// i assume having it outside the thingy is find then?
// saves ~60ms
//var ajv = Ajv();

var search = async (context, next) => {
    debug('response-stage');
    
    await validate(context);
    await verifyAllowedAndPlausible(context);

    var { 
        db, request,
        __displayFields: displayFields,
    } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;

    var {
        target = 'table',
        searchOptions = {},
        filters,
        extraIds = [], // TODO
        excludedIds = [],
        constraints = {},
        showHidden = false,
        offset,
        limit,
    } = request.body;

    var definedQuickSearch = convertFiltersToQueryPairs({
        filters,
        displayFields,
    });

    var mongoSettings = {
        allowDiskUse: true,
        collation: getMongoCollation({ language }),
    }

    var baseStages = SearchBaseStages({
        definedQuickSearch,

        constraints,
        //onlyIds,
        excludedIds,
        showHidden
    });

    var countStages = [
        ...baseStages,
        { $count: 'totalRecordCount' }
    ];
    
    var [{ totalRecordCount } = {}] = await withRetracedErrors(
        aggregateToArray({ db, helperSetItem: countStages, mongoSettings })
    );
   
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

    var records = await withRetracedErrors(
        aggregateToArray({ db, helperSetItem: searchStages, mongoSettings })
    );

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

module.exports = search;
