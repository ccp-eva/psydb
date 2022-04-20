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

    AgeFrameInterval,
    DateOnlyServerSideInterval,
    Timezone,
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
        customScientificFilters: {
            type: 'object',
            /*properties: { dateOfBirth: { oneOf: [
                ExactObject({
                    properties: { interval: DateOnlyServerSideInterval() },
                    required: ['interval']
                }),
                ExactObject({
                    properties: { ageFrame: AgeFrameInterval() },
                    required: ['ageFrame']
                })
            ]}}*/
        },
        
        specialFilters: ExactObject({
            properties: {
                subjectId: SaneString(),
                onlineId: SaneString(),
                sequenceNumber: Integer(),
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
        limit: Integer({ maximum: 1000 }),
        timezone: Timezone(),
    },
    required: [
        'subjectType',
        'customGdprFilters',
        'customScientificFilters',
        'specialFilters',

        'columns',
        'timezone',
    ]
});

module.exports = RequestBodySchema;
