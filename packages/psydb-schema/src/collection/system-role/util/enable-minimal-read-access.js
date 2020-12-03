'use strict';
var inline = require('@cdxoo/inline-text');

var EnableMinimalReadAccess = () => ({
    type: 'bool',
    default: false,
    description: inline`
        grants access to search items by id and
        read the attribute designated as label;
        needs to be enabled in order to read/write
        foreign key fields pointing to this collection
    `,
});

module.exports = EnableMinimalReadAccess;
