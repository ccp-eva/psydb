'use strict';
var debug = require('debug')('psydb:api:endpoints:study:list');
var { entries } = require('@mpieva/psydb-core-utils');
var { fixRelated } = require('@mpieva/psydb-common-lib');

var {
    ResponseBody,
    validateOrThrow,
    convertFiltersToQueryPairs,

    fetchRecordsByFilter,

    mappifyPointer,
    fetchRecordLabelsManual,
    fetchHelperSetItemLabelsManual,
} = require('@mpieva/psydb-api-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var gatherDisplayFields = require('./gather-display-fields');
var gatherSharedDisplayFields = require('./gather-shared-display-fields');
var gatherAvailableConstraints = require('./gather-available-constraints');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    debug('start validating');

    validateOrThrow({
        schema: CoreBodySchema(),
        payload: request.body,
        //unmarshalClientTimezone: timezone,
    });

    var { target = 'table', recordType = undefined } = request.body;

    var displayFields = undefined;
    var availableConstraints = undefined;
    if (recordType) {
        displayFields = await gatherDisplayFields({
            db, collection: 'study', recordType, target,
        });
        availableConstraints = await gatherAvailableConstraints({
            db, collection: 'study', recordType
        }); // XXX
    }
    else {
        displayFields = await gatherSharedDisplayFields({
            db, collection: 'study', target,
        });
        availableConstraints = []; // XXX
    }

    validateOrThrow({
        schema: FullBodySchema({
            availableConstraints,
            availableQuickSearchFields: displayFields
        }),
        payload: request.body,
        unmarshalClientTimezone: timezone,
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
        collectionName: 'study',
        recordType,
        hasSubChannels: false,

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

    var fromItems = mappifyPointer(records, { spreadArrays: true });
    var todoRecordIds = {};
    var todoHelperSetItemIds = [];
    for (var it of displayFields) {
        var { systemType, pointer, props } = it;

        if (/^ForeignId/.test(systemType)) {
            var { collection } = props;
            todoRecordIds[collection] = fromItems(pointer);
        }

        if (/^HelperSetItem/.test(systemType)) {
            todoHelperSetItemIds.push(...fromItems(pointer));
        }
    }

    debug('fetching related...');
    var relatedRecordLabels = await fetchRecordLabelsManual(
        db, todoRecordIds, { ...i18n, oldWrappedLabels: true }
    );
    var relatedHelperSetItems = await fetchHelperSetItemLabelsManual(
        db, todoHelperSetItemIds, { ...i18n, oldWrappedLabels: true }
    );
    debug('done');

    var __related = {
        relatedRecordLabels,
        relatedHelperSetItems
    }

    context.body = ResponseBody({
        data: {
            records,
            displayFieldData: displayFields,
            recordsCount: records.totalRecordCount,
            //related: fixRelated(__related, { isResponse: false }),
            ...(__related),
        },
    });

    await next();
}

module.exports = listEndpoint;
