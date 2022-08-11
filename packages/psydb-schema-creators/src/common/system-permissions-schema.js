'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId,
    ExactObject,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var systemPermissionsSchema = ExactObject({
    title: 'System-Einstellungen',
    systemType: 'SystemPermissions',
    properties: {
        accessRightsByResearchGroup: {
            title: 'Zugriff auf diesen Datensatz für',
            type: 'array',
            default: [],
            minItems: 1,
            // unqiueItemProperties requires "ajv-keywords"
            uniqueItemProperties: [ 'researchGroupId' ],
            items: {
                type: 'object',
                properties: {
                    researchGroupId: ForeignId({
                        title: 'Forschungsgruppe',
                        collection: 'researchGroup'
                    }),
                    permission: {
                        title: 'Berechtigung',
                        type: 'string',
                        enum: [ 'read', 'write' ],
                        enumNames: [ 'Lesen', 'Schreiben' ]
                    }
                },
                required: [
                    'researchGroupId',
                    'permission'
                ],
            },
            description: inline`
                controls wether what access right personnel of
                the specified institutes have on the data
                of this database record; to remove the access
                completely remove the item of that institute from
                the list; this list needs to have at least one
                item to prevent it becoming invisible on accident
            `
        },


        isHidden: DefaultBool(),

        //isHiddenForResearchGroupIds: {
        //    title: 'Ausgeblendet für',
        //    type: 'array',
        //    default: [],
        //    unqiueItems: true,
        //    items: ForeignId({
        //        title: 'Forschungsgruppe',
        //        collection: 'researchGroup'
        //    }),
        //    description: inline`
        //        hides the database record from view for that institute
        //        in a soft way, i.e. one can always choose to show
        //        hidden records; also this way the permissions are
        //        retained to that it can be unhidden again
        //    `,
        //}
    },
    required: [
        'accessRightsByResearchGroup',
        'isHidden'
        //'isHiddenForResearchGroupIds'
    ]
});

module.exports = systemPermissionsSchema;
