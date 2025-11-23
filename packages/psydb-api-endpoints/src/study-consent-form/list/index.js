'use strict';
var debug = require('debug')('psydb:api:endpoints:studyTemplateForm:list');
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
    gatherDisplayFields,
    gatherSharedDisplayFields,
    gatherAvailableConstraints,
} = require('@mpieva/psydb-api-endpoint-lib');

var futils = require('@mpieva/psydb-custom-fields-mongo');

var BodySchema = require('./body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    debug('start validating');

    validateOrThrow({
        schema: BodySchema(),
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
        extraIds, excludedIds, // NOTE: only for option list
        quicksearch = {}, constraints = {},
        showHidden, offset, limit, sort,
    } = request.body;

    debug('done validating');

    // FIXME: thtas a hotfixed for $in in constraint values
    constraints = entries(constraints).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? { $in: value } : value
    }), {});
    ///
   
    var definedQuickSearch = convertFiltersToQueryPairs({
        filters: quicksearch, displayFields,
    });

    var stages = SmartArray([
        ...futils.createFullQuicksearchStages({
            quicksearch, definitions: [
                { systemType: 'SaneString', pointer: '/state/internalName' },
                { systemType: 'SaneString', pointer: '/state/title' }
            ]
        }),
        
    ]);

    var records = await aggregateToArray({ db, studyConsentForm: stages });

    // TODO: rework this
    debug('>>>>>>>>> START FETCH');
    var records = await fetchRecordsByFilter({
        db,
        permissions,
        collectionName: 'studyConsentForm',
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
