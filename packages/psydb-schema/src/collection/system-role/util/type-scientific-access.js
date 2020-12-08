'use strict';
var inline = require('@cdxoo/inline-text');

var ScientificAccess = () => ({
    type: 'object',
    properties: {
        read: {
            type: 'bool',
            default: false,
            description: inline`
                grants access to read all fields of the scientific portion
                of that types database records
            `,
        },
        search: {
            type: 'bool',
            default: false,
            description: inline`
                grants the ability to use all scientific fields
                field in search queries for that types database records
            `,
        },
        write: {
            type: 'bool',
            default: false,
            description: inline`
                grants access to write data to all fields of
                the scientific portion of that types database records
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
