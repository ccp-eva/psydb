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
    ForeignId,
    ForeignIdList,
    FullText,

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
        // XXX
        customGdprFilters: { type: 'object' },
        customScientificFilters: {
            type: 'object',
        },
        
        specialFilters: ExactObject({
            properties: {
                subjectId: SaneString(),
                onlineId: SaneString(),
                sequenceNumber: SaneString(),
                didParticipateIn: ForeignIdList({
                    collection: 'study'
                }),
                didNotParticipateIn: ForeignIdList({
                    collection: 'study',
                }),
                hasTestingPermission: ExactObject({
                    properties: {
                        labMethod: { type: 'string' },
                        researchGroupId: ForeignId({
                            collection: 'researchGroup'
                        })
                    },
                }),
                comment: FullText(),
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
        'subjectType',
        'customGdprFilters',
        'customScientificFilters',
        'specialFilters',

        'columns',
        'timezone',
    ]
});

module.exports = RequestBodySchema;
