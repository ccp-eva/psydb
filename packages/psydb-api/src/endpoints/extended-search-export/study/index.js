'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extended-search-export:studies'
);

var { copy } = require('copy-anything');
var { __fixRelated, __fixDefinitions } = require('@mpieva/psydb-common-compat');
var { jsonpointer, keyBy } = require('@mpieva/psydb-core-utils');
var { Fields } = require('@mpieva/psydb-custom-fields-common');

var {
    CSV,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var studyExtendedSearchExport = async (context, next) => {
    var { db, permissions, request, i18n } = context;

    var precheckBody = copy(request.body);
    validateOrThrow({
        schema: RequestBodySchema.Core(),
        payload: precheckBody
    });

    var {
        studyType
    } = precheckBody;

    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: studyType,
    });

    validateOrThrow({
        schema: RequestBodySchema.Full(crtSettings),
        payload: request.body
    });

    var {
        customFilters,
        specialFilters,

        columns,
        sort,
    } = request.body;

    var {
        records,
        recordsCount,
        related,
        displayFieldData,
    } = await extendedSearch.core({
        db,
        permissions,
        collection: 'study',
        recordType: studyType,

        columns,
        sort,

        customFilters,
        specialFilterConditions: (
            extendedSearch.study.createSpecialFilterConditions(specialFilters)
        ),
    });

    // FIXME
    related = __fixRelated(related, { isResponse: false });
    displayFieldData = __fixDefinitions(displayFieldData);

    var columnDefinitions = keyBy({
        items: displayFieldData,
        byProp: 'pointer'
    });

    displayFieldData = columns.map(pointer => columnDefinitions[pointer]);

    var csv = CSV();
    csv.addLine(displayFieldData.map(it => it.displayName));
    for (var record of records) {
        csv.addLine(displayFieldData.map(definition => {
            var { systemType } = definition;

            var stringify = Fields[systemType]?.stringifyValue;
            var str = stringify ? (
                stringify({ record, definition, related, i18n })
            ) : '[!!ERROR!!]]';
            
            return str;
        }))
    }

    //console.log(csv.toString());
    context.body = csv.toString();

    await next();
}

module.exports = studyExtendedSearchExport;

