'use strict';
var ExactObject = require('./exact-object');

var PhoneList = ({ minItems, numbertypes }) => ({
    type: 'array',
    minItems: (minItems || 0),
    items: ExactObject({
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
    }),
})

module.exports = PhoneList;
