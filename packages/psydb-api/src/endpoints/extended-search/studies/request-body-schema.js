'use strict';

var {
    ExactObject,
    MinObject,
    MaxObject,
    CustomRecordTypeKey,
    DefaultArray,
    JsonPointer,
    Integer,
    DefaultBool,
    StringEnum,
    SaneString,
    SaneStringList,
    ForeignIdList,

    Timezone,
} = require('@mpieva/psydb-schema-fields');



var RequestBodySchema = {};
RequestBodySchema.Core = () => MinObject({
    'studyType': CustomRecordTypeKey({ collection: 'study' }),
})

var NegatableForeignIdList = (bag) => {
    // FIXME: not sure if MaxObject is correct though
    var schema = MaxObject({
        'any': DefaultBool(),
        'negate': DefaultBool(),
        'values': ForeignIdList({ ...bag })
    });

    return schema;
}

RequestBodySchema.Full = (bag) => {
    var { apiConfig } = bag;
    var { dev_enableWKPRCPatches: IS_WKPRC } = apiConfig;
    
    var required = {
        'studyType': CustomRecordTypeKey({ collection: 'study' }),
        'customFilters': { type: 'object' },
        'specialFilters': MaxObject({
            'studyId': SaneString(),
            'sequenceNumber': SaneString(),
            'name': SaneString(),
            ...(!IS_WKPRC && {
                'shorthand': SaneString(),
            }),

            'scientistIds': NegatableForeignIdList({
                collection: 'personnel'
            }),
            'researchGroupIds': NegatableForeignIdList({
                collection: 'researchGroup'
            }),
            'studyTopicIds': NegatableForeignIdList({
                collection: 'studyTopic'
            }),

            ...(IS_WKPRC && {
                'experimentNames': SaneStringList({ minLength: 0 })
            }),

            'isHidden': StringEnum([ 'any', 'only-true', 'only-false' ])
        }),
        'columns': DefaultArray({
            items: JsonPointer(),
            minItems: 1,
        }),
        'timezone': Timezone(),
    };

    var optional = {
        'sort': MaxObject({
            'column': JsonPointer(),
            'direction': StringEnum([ 'asc', 'desc' ]),
        }),
        'offset': Integer({ minimum: 0 }),
        'limit': Integer({ maximum: 1000 }),
    };

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required)
    });

    return schema;
}

module.exports = RequestBodySchema;
