'use strict';
var inline = require('@cdxoo/inline-text');

var FieldAccess = ({
    implicitRead
} = {}) => ({
    type: 'object',
    properties: {
        ...(
            implicitRead 
            ? undefined
            : ({
                read: {
                    type: 'bool',
                    default: false,
                    description: inline`
                        grants the user access to read the field
                    `,
                },
            })
        ),
        search: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user the ability to use the specified
                field in search queries
            `,
        },
        write: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user access to write data to the field
            `,
        },
    },
    required: [
        'read',
        'search',
        'write',
    ],
});

module.exports = FieldAccess;
