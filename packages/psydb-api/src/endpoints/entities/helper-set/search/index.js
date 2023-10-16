'use strict';
var debug = require('debug')('psydb:api:endpoints:helperSet:search');

var { copy } = require('copy-anything');
var { SmartArray, fieldTypeMetadata } = require('@mpieva/psydb-common-lib');

var {
    SearchBaseStages,
    PaginationStages,
    StripRohrpostMetadataStage,
} = require('@mpieva/psydb-mongo-stages');

var {
    ApiError,
    validateOrThrow,
    withRetracedErrors,
    ResponseBody,

    gatherAvailableConstraintsForRecordType,
    convertFiltersToQueryFields, 
} = require('@mpieva/psydb-api-lib');

var fieldTypeConversions = (
    require('@mpieva/psydb-api-lib/src/mongodb-field-type-conversions')
);

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var {
    getMongoCollation,
    aggregateToArray,

    translationExists,
} = require('./utils');

// NOTE https://github.com/ajv-validator/ajv/issues/242
// i assume having it outside the thingy is find then?
// saves ~60ms
//var ajv = Ajv();
var { isArray } = Array;
var { keys } = Object;

var search = async (context, next) => {
    debug('endpoints/search');
    var { 
        db,
        permissions,
        request
    } = context;

    var { language = 'en', locale, timezone } = request.headers;

    var precheckBody = copy(request.body);
    validateOrThrow({
        schema: CoreBodySchema(),
        payload: precheckBody
    })

    var {
        collectionName = 'helperSet',
        target = 'table',
        showHidden = false,
    } = precheckBody;
    
    var availableConstraints = await (
        gatherAvailableConstraintsForRecordType({
            db, collectionName: 'helperSet',
        })
    );

    var availableDisplayFieldData = (
        [
            { key: '_labelEN', pointer: '/state/label' },
            { key: '_labelDE', pointer: '/state/displayNameI18N/de' },
        ].map(({ key, pointer }) => ({
            key,
            pointer,
            dataPointer: pointer, // FIXME
            
            systemType: 'SaneString',
            displayName: 'Table Name',
            displayNameI18N: { de: 'Tabellen-Bezeichnung' },
        }))
    );
    var displayFields = availableDisplayFieldData;


    validateOrThrow({
        schema: FullBodySchema({
            availableConstraints,
            availableFilterFields: displayFields
        }),
        payload: request.body
    });
    
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

    var baseStages = SearchBaseStages({
        queryFields,
        fieldTypeConversions,

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
