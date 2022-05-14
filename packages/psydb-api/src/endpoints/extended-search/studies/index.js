'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:studies'
);

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var studyExtendedSearch = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

    validateOrThrow({
        schema: RequestBodySchema.Core(),
        payload: request.body
    });

    var {
        studyType
    } = request.body;

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
        offset = 0,
        limit = 0
    } = request.body;

    var {
        records,
        recordsCount,
        related,
        displayFieldData,
    } = await extendedSearch.core({
        db,
        collection: 'study',
        recordType: studyType,

        columns,
        sort,
        offset,
        limit,

        customFilters,
        specialFilterConditions: (
            extendedSearch.study.createSpecialFilterConditions(specialFilters)
        ),
    });

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData,
        },
    });
}

module.exports = studyExtendedSearch;

