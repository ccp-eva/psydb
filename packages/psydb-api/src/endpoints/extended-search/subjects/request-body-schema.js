'use strict';

var {
    ExactObject,
    OpenObject,
    CustomRecordTypeKey,
    DefaultArray,
    JsonPointer,
    Integer,
    StringEnum,
    SaneString,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = {};
RequestBodySchema.Core = () => OpenObject({
    properties: {
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
    },
    required: [ 'subjectType' ]
})

RequestBodySchema.Full = () => ExactObject({
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
        sort: ExactObject({
            properties: {
                column: JsonPointer(),
                direction: StringEnum([ 'asc', 'desc' ]),
            },
            required: [],
        }),
        offset: Integer({ minimum: 0 }),
        limit: Integer({ maximum: 250 }),
    },
    required: [
        'subjectType',
        'customGdprFilters',
        'customScientificFilters',
        'specialFilters',

        'columns',
    ]
});

module.exports = RequestBodySchema;
