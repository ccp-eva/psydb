'use strict';
var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var coreState = require('../core-state');

var coreLocationState = {
    allOf: [
        {
            type: 'object',
            properties: {
                canBeReserved: { type: 'boolean', default: false },
                canBeReservedByInstituteIds: {
                    type: 'array',
                    items: ForeignId('institute'),
                },
            }
        },
        coreState,
    ]
};

module.exports = coreLocationState;
