'use strict';
var inline = require('@cdxoo/inline-text');

var EnableFullStateReadAccess = () => ({
    type: 'bool',
    default: false,
    description: inline`
        grants access to read items by id and
        read all attributes;
    `,
});

module.exports = EnableStateScientificReadAccess;
