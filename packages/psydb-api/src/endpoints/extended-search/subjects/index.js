'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:subjects'
);

var {
    ResponseBody,
    validateOrThrow,
    fromFacets,

    fetchOneCustomRecordType,
    convertPointerToPath,
} = require('@mpieva/psydb-api-lib');


var {
    createCustomQueryValues,
    getCustomQueryPointer,
    convertPointerKeys
} = require('../utils');

var RequestBodySchema = require('./request-body-schema');

var subjectExtendedSearch = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var {
        subjectType,
        customGdprFilters,
        customScientificFilters,
        specialFilters,

        columns,
        sort,
        offset = 0,
        limit = 0
    } = request.body;

    var crt = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectType
    });

    var { subChannelFields } = crt.state.settings;

    var customFields = {
        scientific: (
            subChannelFields.scientific.filter(it => !it.isRemoved)
        ),
        gdpr: (
            subChannelFields.gdpr.filter(it => !it.isRemoved)
        )
    };

    var customQueryValues = {
        ...createCustomQueryValues({
            fields: customFields.scientific,
            filters: customScientificFilters,
        }),
        ...createCustomQueryValues({
            fields: customFields.gdpr,
            filters: customGdprFilters,
        }),
    }

    console.dir(customQueryValues, { depth: null })

    var stages = [
        { $match: {
            ...convertPointerKeys(customQueryValues),
        }},
        { $project: {
            ...columns.reduce((acc, pointer) => ({
                ...acc,
                [ convertPointerToPath(pointer) ]: true
            }), {}),
        }},
        { $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ];

    console.dir({ stages }, { depth: null });

    var facets = await (
        db.collection('subject').aggregate(stages).toArray()
    );
    
    var [ records, recordsCount ] = fromFacets(facets);

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
        },
    });
}


module.exports = subjectExtendedSearch;

