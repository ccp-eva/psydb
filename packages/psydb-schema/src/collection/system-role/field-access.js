'use strict';
var inline = require('@cdxoo/inline-text');

var FieldAccess = () => ({
    type: 'object',
    properties: {
        // TODO: we can actually know which paths are valid
        // when we know chat collection it isi, do we want to do that?
        fieldPointer: {
            type: 'string',
            format: 'json-pointer',
        },
        read: {
            type: 'bool',
            default: false,
            description: inline`
                grants the user access to read the field
            `,
        },
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
        'fieldPointer',
        'read',
        'search',
        'write',
    ],
});

module.exports = FieldAccess;
