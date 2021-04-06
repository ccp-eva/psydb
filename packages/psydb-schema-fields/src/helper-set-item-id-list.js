'use strict';
var inline = require('@cdxoo/inline-text'),
    ExactObject = require('./exact-object'),
    IdentifierString = require('./identifier-string');

var HelperSetItemIdList = ({ minItems }) => ({
    systemType: 'HelperSetItemIdList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: IdentifierString(),
})

module.exports = HelperSetItemIdList;
