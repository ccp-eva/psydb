'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    DefaultArray,
    JsonPointer,
    AgeFrameInterval,
} = require('@mpieva/psydb-schema-fields');

var AgeFrameState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            interval: AgeFrameInterval({
                title: 'Altersfenster',
                startKeywords: { title: 'Beginn' },
                endKeywords: { title: 'Ende' },
            }),
            conditions: DefaultArray({
                items: ExactObject({
                    properties: {
                        pointer: JsonPointer(),
                        values: DefaultArray({
                            items: { type: [ 'string', 'number' ]},
                            minItems: 1,
                        }),
                    },
                    required: [
                        'pointer',
                        'values',
                    ]
                }),
                minItems: 0,
            })
        },
        required: [
            'interval',
            'conditions'
        ]
    })

    return schema;
}

module.exports = AgeFrameState;

