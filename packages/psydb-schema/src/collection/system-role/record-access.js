'use strict';
var inline = require('@cdxoo/inline-text');

var RecordAccess = () => ({
    type: 'object',
    properties: {
        read: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user access to read any field of database
                records in this collection
            `,
        },
        search: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user the abilty to search for any field
                of records in the collection
            `,
        },
        write: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user access to write any field of database
                records in this collection
            `,
        },
    },
    required: [
        'read',
        'search',
        'write',
    ],
});

module.exports = RecordAccess;
