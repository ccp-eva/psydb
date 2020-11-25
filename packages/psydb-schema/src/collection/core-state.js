'use strict';
var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var coreState = {
    type: 'object',
    properties: {
        systemPermissions: {
            type: 'object',
            properties: {
                canBeViewedByInstituteIds: {
                    type: 'array',
                    items: ForeignId('institute'),
                    default: [],
                },
                canBeEditedByInstituteIds: {
                    type: 'array',
                    items: ForeignId('institute'),
                    default: [],
                },
            }
        },
        isHiddenForInstituteIds: {
            type: 'array',
            items: ForeignId('institute'),
            default: [],
        }
    }
}

module.exports = coreState;
