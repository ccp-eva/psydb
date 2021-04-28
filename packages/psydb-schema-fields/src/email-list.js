'use strict';
var inline = require('@cdxoo/inline-text'),
    DefaultArray = require('./default-array'),
    ExactObject = require('./exact-object'),
    DefaultBool = require('./default-bool'),
    Email = require('./email');

var EmailList = ({ minItems, ...additionalProperties }) => DefaultArray({
    systemType: 'EmailList',
    minItems: (minItems || 0),
    // unqiueItemProperties requires "ajv-keywords"
    uniqueItemProperties: [ 'email' ],
    items: ExactObject({
        systemType: 'EmailListItem',
        properties: {
            email: Email(),
            isPrimary: DefaultBool({
                description: inline`
                    controls if this email is the primary
                    one this is relevant when the system
                    wants to send emails or checks login
                `,
            })
        },
        required: [
            'email',
            'isPrimary',
        ]
    }),
    title: 'Emails',
    ...additionalProperties,
})

module.exports = EmailList;
