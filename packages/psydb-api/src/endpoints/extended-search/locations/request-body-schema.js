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
        locationType: CustomRecordTypeKey({ collection: 'location' }),
    },
    required: [ 'locationType' ]
})

var NegatableForeignIdList = (bag) => {
    return ExactObject({
        properties: {
            negate: DefaultBool(),
            values: ForeignIdList({
                ...bag
            }),
        }
    });
}

RequestBodySchema.Full = () => ExactObject({
    properties: {
        locationType: CustomRecordTypeKey({ collection: 'location' }),
        customFilters: { type: 'object' },
        
        specialFilters: ExactObject({
            properties: {
                locationId: SaneString(),
                sequenceNumber: Integer(),
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
        'locationType',
        'customFilters',
        'specialFilters',

        'columns',
        'timezone',
    ]
});

module.exports = RequestBodySchema;
