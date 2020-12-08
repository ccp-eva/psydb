'use strict';
var inline = require('@cdxoo/inline-text');

var EnableFullGdprReadAccess = () => ({
    type: 'bool',
    default: false,
    description: inline`
        grants access to read items by id and
        read all attributes of the gdpr portion;
    `,
});

module.exports = EnableFullScientificReadAccess;
