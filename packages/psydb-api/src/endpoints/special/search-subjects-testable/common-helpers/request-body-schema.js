'use strict';
var {
    ExactObject,
    DefaultArray,
    CustomRecordTypeKey,
    ForeignId,
    ForeignIdList,
    JsonPointer,
    DefaultBool,
    DateOnlyServerSideInterval,
    DateTimeInterval,
    Integer,
    Timezone,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        timezone: Timezone(),

        subjectTypeKey: CustomRecordTypeKey({ collection: 'subject' }),
        studyTypeKey: CustomRecordTypeKey({ collection: 'study' }),
        studyIds: ForeignIdList({ collection: 'study' }),

        interval: DateTimeInterval(),
        filters: DefaultArray({
            items: { oneOf: [
                AgeFrameFilter(),
                ValueFilter(),
            ]}
        }),
        quickSearchFilters: { type: 'object' }, // FIXME

        offset: Integer(),
        limit: Integer(),

        output: StringEnum([ 'full', 'only-ids' ]),
    },
    required: [
        'timezone',
        'subjectTypeKey',
        'studyTypeKey',
        'studyIds',
        'interval',
        'filters',
        'offset',
        'limit',
    ]
})

var AgeFrameFilter = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
        ageFrameId: ForeignId({ collection: 'ageFrame' }),
        isEnabled: DefaultBool(),
    },
    required: [
        'studyId',
        'ageFrameId',
        'isEnabled',
    ]
});

var ValueFilter = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
        ageFrameId: ForeignId({ collection: 'ageFrame' }),
        pointer: JsonPointer(),
        value: { type: [ 'string', 'number' ] },
        isEnabled: DefaultBool(),
    },
    required: [
        'studyId',
        'ageFrameId',
        'pointer',
        'value',
        'isEnabled',
    ]
});

module.exports = RequestBodySchema
