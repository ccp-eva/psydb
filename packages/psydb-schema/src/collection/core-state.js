'use strict';
var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var coreState = {
    type: 'object',
    properties: {
        canBeViewedByInstituteIds: {
            type: 'array',
            items: ForeignId('institute'),
        },
        canBeEditedByInstituteIds: {
            type: 'array',
            items: ForeignId('institute'),
        },
        isHiddenForInstituteIds: {
            type: 'array',
            items: ForeignId('institute'),
        }
    }
}

module.exports = coreState;
