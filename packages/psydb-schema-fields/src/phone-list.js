'use strict';
var PhoneList = ({ minItems, numbertypes }) => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    minItems: (minItems || 0),
    items: {
        type: 'object',
        reactType: 'phone',
        properties: {
            number: {
                type: 'string',
                format: 'phone-number', // custom format
            },
            type: { enum: (numbertypes || [
                'business',
                'private',
                'mobile', // is that still a thing?
            ])}
        },
        required: [
            'number',
            'type'
        ]
    },
})

module.exports = PhoneList;
