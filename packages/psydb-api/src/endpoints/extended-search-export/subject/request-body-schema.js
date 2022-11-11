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
    ForeignId,
    ForeignIdList,
    
    Timezone,
} = require('@mpieva/psydb-schema-fields');



var RequestBodySchema = {};
RequestBodySchema.Core = () => OpenObject({
    properties: {
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
    },
    required: [ 'subjectType' ]
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
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
        customGdprFilters: { type: 'object' },
        customScientificFilters: { type: 'object' },
        
        specialFilters: ExactObject({
            properties: {
                subjectId: SaneString(),
                sequenceNumber: Integer(),
                onlineId: SaneString(),
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
