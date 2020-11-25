'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var systemPermissionsSchema = {
    type: 'object',
    properties: {
        accessRightsByInstitute: {
            type: 'array',
            default: [],
            // unqiueItemProperties requires "ajv-keywords"
            uniqueItemProperties: [ 'instituteId' ],
            items: {
                type: 'object',
                properties: {
                    instituteId: ForeignId('institute'),
                    permission: { enum: [ 'read', 'write' ] }
                },
                required: [
                    'instituteId',
                    'permission'
                ],
            },
            description: inline`
                controls wether what access right personnel of
                the specified institutes have on the data
                of this database record; to remove the access
                completely remove the item of that institute from
                the list
            `
        },

        /*
        canBeViewedByInstituteIds: {
            type: 'array',
            default: [],
        },
        canBeEditedByInstituteIds: {
            type: 'array',
            items: ForeignId('institute'),
            default: [],
        },
        */

        isHiddenForInstituteIds: {
            type: 'array',
            default: [],
            unqiueItems: true,
            items: ForeignId('institute'),
        }
    }
}

module.exports = systemPermissionsSchema;
