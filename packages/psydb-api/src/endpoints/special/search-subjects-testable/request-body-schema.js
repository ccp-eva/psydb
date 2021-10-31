'use strict';
var {
    ExactObject,
    DefaultArray,
    CustomRecordTypeKey,
    ForeignId,
    JsonPointer,
    DefaultBool,
    DateOnlyServerSideInterval,
    Integer,
    Timezone,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        timezone: Timezone(),
        subjectTypeKey: CustomRecordTypeKey({ collection: 'subject' }),
        interval: DateOnlyServerSideInterval(),
        filters: DefaultArray({
            items: { oneOf: [
                AgeFrameFilter(),
                ValueFilter(),
            ]}
        }),

        offset: Integer(),
        limit: Integer(),
    },
    required: [
        'timezone',
        'subjectTypeKey',
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
