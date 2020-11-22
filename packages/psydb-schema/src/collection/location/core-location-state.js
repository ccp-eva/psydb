'use strict';
var ForeignKey = require('../../foreign-key');

var coreLocationState = {
    type: 'object',
    properties: {
        canBeReserved: { type: 'boolean', default: false },
        canBeReservedByInstitutes: {
            type: 'array',
            items: ForeignKey('institute'),
        },
    }
};

module.exports = coreLocationState;
