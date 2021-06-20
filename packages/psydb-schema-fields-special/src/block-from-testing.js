'use strict';
var {
    ExactObject,
    DefaultBool,
    DateOnlyServerSide
} = require('@mpieva/psydb-schema-fields');

var BlockFromTesting = ({
    noTitle,
    yesTitle,
    ...additionalProperties
} = {}) => ({
    type: 'object',
    systemType: 'BlockFromTesting',
    lazyResolveProp: 'shouldBlock',
    oneOf: [
        ExactObject({
            title: noTitle || 'Nein',
            properties: {
                shouldBlock: DefaultBool({ const: false }),
            },
            required: [
                'shouldBlock'
            ]
        }),
        ExactObject({
            title: yesTitle || 'Ja',
            properties: {
                shouldBlock: DefaultBool({ const: true, default: true }),
                blockUntil: DateOnlyServerSide({ title: 'bis' })
            },
            required: [
                'shouldBlock',
                'blockUntil',
            ]
        })
    ],
    ...additionalProperties,
});

module.exports = BlockFromTesting;
