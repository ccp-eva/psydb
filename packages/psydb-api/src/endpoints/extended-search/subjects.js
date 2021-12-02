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
    ExactObject,
    CustomRecordTypeKey,
    DefaultArray,
    JsonPointer,
    Integer,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
        customGdprFilters: { type: 'object' },
        customScientificFilters: { type: 'object' },
        
        specialFilters: ExactObject({
            properties: {
                subjectId: SaneString(),
                //didParticipate: StringEnum([ 'yes'. 'no', 'any' ]),
                didParticipateIn: ForeignIdList({
                    collection: 'study'
                }),
                didNotParticipateIn: ForeignIdList({
                    collection: 'study',
                }),
            }
        }),

        columns: DefaultArray({
            items: JsonPointer(),
            minItems: 1,
        }),
        offset: Integer({ minimum: 0 }),
        limit: Integer({ maximum: 100 }),
    },
    required: [
        'subjectType',
        'customGdprFilters',
        'customScientificFilters',
        'specialFilters',

        'columns',
    ]
})

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

var createCustomQueryValues = (options) => {
    var { fields, filters } = options;
    var values = {};

    for (var field of fields) {
        var { key } = field;
        var filter = filters[key];
        if (filter) {
            var pointer = getCustomQueryPointer({ field });
            var value = createOneCustomQueryValue({
                field, filter: filters[key]
            });

            values[pointer] = value;
        }
    }

    return values;
}

var createOneCustomQueryValue = (options) => {
    var { field, filter } = options;
    var { type } = field;
    switch (type) {
        case 'SaneString':
        case 'PhoneList':
        case 'EmailList':
            return new RegExp(filter, 'i');

        case 'BiologicalGender':
        case 'ExtBool':
            filter = filter || {};
            return { $in: Object.keys(filter).filter(key => !!filter[key]) }

        case 'ForeignId':
        case 'ForeignIdList':
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
            filter = filter || {};
            var op = filter.negate ? '$nin' : '$in';
            return { [op]: filter.values };
    }
}

var getCustomQueryPointer = (options) => {
    var { field } = options;
    var { type, pointer } = field;

    switch (type) {
        case 'SaneString':
        case 'ForeignId':
        case 'ForeignIdList':
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
        case 'BiologicalGender':
        case 'ExtBool':
            return pointer;

        case 'PhoneList':
            return `${pointer}/number`;
        case 'EmailList':
            return `${pointer}/email`;
    }
}

var convertPointerKeys = (obj) => {
    var converted = Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        [ convertPointerToPath(key) ]: obj[key],
    }), {});

    return converted;
}

module.exports = subjectExtendedSearch;

