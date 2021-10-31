'use strict';
var {
    ExactObject,
    DefaultArray,
    ForeignId,
    JsonPointer,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        interval: DateOnlyServerSideInterval(),
        filters: DefaultArray({
            items: { oneOf: [
                AgeFrameFilter(),
                ValueFilter(),
            ]}
        })
    },
    required: [
        'interval',
        'filters',
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
