'use strict';
var inline = require('@cdxoo/inline-text'),
    ExactObject = require('./exact-object');

var EmailList = ({ minItems }) => ({
    type: 'array',
    minItems: (minItems || 0),
    // unqiueItemProperties requires "ajv-keywords"
    uniqueItemProperties: [ 'email' ],
    items: ExactObject({
        properties: {
            email: {
                type: 'string',
                format: 'email'
            },
            isPrimary: {
                type: 'boolean',
                default: false,
                description: inline`
                    controls if this email is the primary
                    one this is relevant when the system
                    wants to send emails or checks login
                `,
            }
        },
        required: [
            'email',
            'isPrimary',
        ]
    }),
})

module.exports = EmailList;
