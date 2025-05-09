'use strict';

var {
    ExactObject,
    OpenObject,
    CustomRecordTypeKey,
    DefaultArray,
    JsonPointer,
    Integer,
    DefaultBool,
    StringEnum,
    SaneString,
    ForeignIdList,

    AgeFrameInterval,
    DateOnlyServerSideInterval,
    Timezone,
} = require('@mpieva/psydb-schema-fields');



var RequestBodySchema = {};
RequestBodySchema.Core = () => OpenObject({
    properties: {
        studyType: CustomRecordTypeKey({ collection: 'study' }),
    },
    required: [ 'studyType' ]
})

var NegatableForeignIdList = (bag) => {
    return ExactObject({
        properties: {
            any: DefaultBool(),
            negate: DefaultBool(),
            values: ForeignIdList({
                ...bag
            }),
        }
    });
}

RequestBodySchema.Full = () => ExactObject({
    properties: {
        studyType: CustomRecordTypeKey({ collection: 'study' }),
        customFilters: { type: 'object' },
        
        specialFilters: ExactObject({
            properties: {
                studyId: SaneString(),
                sequenceNumber: SaneString(),
                name: SaneString(),
                shorthand: SaneString(),
                scientistIds: NegatableForeignIdList({
                    collection: 'personnel'
                }),

                researchGroupIds: NegatableForeignIdList({
                    collection: 'researchGroup'
                }),
                studyTopicIds: NegatableForeignIdList({
                    collection: 'studyTopic'
                }),

                isHidden: StringEnum([ 'any', 'only-true', 'only-false' ])
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
        limit: Integer({ maximum: 1000 }),
        timezone: Timezone(),
    },
    required: [
        'studyType',
        'customFilters',
        'specialFilters',

        'columns',
        'timezone',
    ]
});

module.exports = RequestBodySchema;
