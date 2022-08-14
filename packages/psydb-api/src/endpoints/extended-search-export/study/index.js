'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extended-search-export:studies'
);

var jsonpointer = require('jsonpointer');
var { copy } = require('copy-anything');
var { keyBy } = require('@mpieva/psydb-core-utils');
var { stringifyFieldValue } = require('@mpieva/psydb-common-lib');

var {
    CSV,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');
var RequestBodySchema = require('./request-body-schema');


var studyExtendedSearchExport = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

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

        timezone,
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

        customFilters,
        specialFilterConditions: (
            extendedSearch.study.createSpecialFilterConditions(specialFilters)
        ),
    });

    var columnDefinitions = keyBy({
        items: displayFieldData,
        byProp: 'dataPointer'
    });

    displayFieldData = columns.map(pointer => columnDefinitions[pointer]);

    var csv = CSV();
    csv.addLine(displayFieldData.map(it => it.displayName));
    for (var record of records) {
        csv.addLine(displayFieldData.map(fieldDefinition => {
            var { dataPointer } = fieldDefinition;
            var rawValue = jsonpointer.get(record, dataPointer);
            
            var str = stringifyFieldValue({
                rawValue,
                fieldDefinition,
                ...related,

                timezone,
            });

            return str;
        }))
    }

    //console.log(csv.toString());
    context.body = csv.toString();

    await next();
}

module.exports = studyExtendedSearchExport;

