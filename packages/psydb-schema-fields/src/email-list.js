'use strict';
var inline = require('@cdxoo/inline-text'),
    DefaultArray = require('./default-array'),
    ExactObject = require('./exact-object'),
    DefaultBool = require('./default-bool'),
    Email = require('./email');

var EmailList = ({ minItems, ...additionalProperties }) => DefaultArray({
    systemType: 'EmailList', // FIXME: rename to EmailWithPrimaryList
    minItems: (minItems || 0),
    items: ExactObject({
        systemType: 'EmailListItem', // FIXME: rename to EMailWithPrimaryItem
        properties: {
            email: Email(),
            isPrimary: DefaultBool({
                title: 'primäre Adresse',
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
    // unqiueItemProperties requires "ajv-keywords"
    uniqueItemProperties: [ 'email', 'isPrimary'],
    ...additionalProperties,
})

module.exports = EmailList;
