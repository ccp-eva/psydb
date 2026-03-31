'use strict';
var debug = require('debug')('psydb:api:endpoints:personnel:list');
var { entries } = require('@mpieva/psydb-core-utils');
var { __fixRelated } = require('@mpieva/psydb-common-compat');

var {
    ResponseBody,
    validateOrThrow,
    convertFiltersToQueryPairs,

    fetchRecordsByFilter,
} = require('@mpieva/psydb-api-lib');

var {
    fetchRelated,
    gatherStaticDisplayFields,
    gatherAvailableConstraints,
} = require('@mpieva/psydb-api-endpoint-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    debug('start validating');

    validateOrThrow({
        schema: CoreBodySchema(),
        payload: request.body, i18n
    });

    var { target = 'table' } = request.body;

    var displayFields = await gatherStaticDisplayFields({
        db, collection: 'personnel', target,
    });
    var availableConstraints = []; // XXX
    //var availableConstraints = await gatherAvailableConstraints({
    //    db, collection: 'personnel',
    //}); // XXX

    validateOrThrow({
        schema: FullBodySchema({
            availableConstraints,
            availableQuickSearchFields: displayFields
        }),
        payload: request.body, i18n
    });

    var {
        searchOptions = {},
        extraIds, excludedIds,
        filters, constraints = {}, showHidden,
        offset, limit,
        sort,
    } = request.body;

    debug('done validating');

    // FIXME: thtas a hotfixed for $in in constraint values
    constraints = entries(constraints).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? { $in: value } : value
    }), {});
    ///
   
    var definedQuickSearch = convertFiltersToQueryPairs({
        filters, displayFields,
    });

    var { enableResearchGroupFilter = true } = searchOptions;
    
    // TODO: rework this
    debug('>>>>>>>>> START FETCH');
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName: 'personnel',
        hasSubChannels: true,

        enableResearchGroupFilter,
        // onlyIds, NOTE: not used here
        extraIds,
        excludedIds,
        constraints,
        
        // FIXME
        queryFields: definedQuickSearch.map(it => ({
            field: it.definition, value: it.input
        })),

        displayFields,
        recordLabelDefinition: undefined, // FIXME
        offset,
        limit,
        sort,

        showHidden,
        // TODO remove this as soon as we
        // can properly quicksearch and search for fk
        //disablePermissionCheck: (target === 'optionlist' ? true : false)
    });

    debug('<<<<<<<<< END FETCH')

    var __related = await fetchRelated({
        db, records, definitions: displayFields, i18n
    });

    context.body = ResponseBody({
        data: {
            records,
            displayFieldData: displayFields,
            recordsCount: records.totalRecordCount,
            //related: __fixRelated(__related, { isResponse: false }),
            ...(__related),
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
