'use strict';
var debug = require('debug')('psydb:api:endpoints:helperSet:search');

var { translationExists } = require('@mpieva/psydb-i18n');
var {
    SmartArray,
    fieldTypeMetadata
} = require('@mpieva/psydb-common-lib');

var {
    SearchBaseStages,
    PaginationStages,
    StripRohrpostMetadataStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    withRetracedErrors,
    SmartArray,

    convertFiltersToQueryFields, 
    aggregateToArray,
    getMongoCollation,
} = require('@mpieva/psydb-api-lib');

var fieldTypeConversions = (
    require('@mpieva/psydb-api-lib/src/mongodb-field-type-conversions')
);

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
        permissions
    } = context;

    var { isRoot, availableHelperSetIds = [] } = permissions;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;

    var {
        searchOptions = {},
        filters,
        extraIds = [], // TODO
        excludedIds = [],
        constraints = {},
        showHidden = false,
        offset,
        limit,
    } = request.body;

    var queryFields = convertFiltersToQueryFields({
        filters,
        displayFields,
        fieldTypeMetadata,
    });

    var mongoSettings = {
        allowDiskUse: true,
        collation: getMongoCollation({ language }),
    }

    var baseStages = SmartArray([
        ( !isRoot() && { $match: {
            _id: { $in: availableHelperSetIds }
        }}),
        ...SearchBaseStages({
            queryFields,
            fieldTypeConversions,

            constraints,
            //onlyIds,
            excludedIds,
            showHidden
        })
    ]);

    var countStages = [
        ...baseStages,
        { $count: 'totalRecordCount' }
    ];
    
    var [{ totalRecordCount } = {}] = await withRetracedErrors(
        aggregateToArray({ db, helperSet: countStages, mongoSettings })
    );
   
    var searchStages = SmartArray([
        ...baseStages,
        StripRohrpostMetadataStage(),
        SortStage({ language }),
        PaginationStages({ limit, offset }),
    ], { spreadArrayItems: true });

    var records = await withRetracedErrors(
        aggregateToArray({ db, helperSet: searchStages, mongoSettings })
    );

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
