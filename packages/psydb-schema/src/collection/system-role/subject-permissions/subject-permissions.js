'use strict';
var inline = require('@cdxoo/inline-text'),
    CombinedTypePermissions = require('./combined-type-permissions');

var SubjectPermissions = ({
    animalScientificStateItems,
    animalGdprStateItems,
    humanScientificStateItems,
    humanGdprStateItems,
} = {}) => ({
    type: 'object',
    properties: {
        
        enableMinimalReadAccess: {
            type: 'bool',
            default: false,
            description: inline`
                grants access to search items by id and
                read the attribute designated as label;
                needs to be enabled in order to read/write
                foreign key fields pointing to this collection
            `,
        },
        
        animal: CombinedTypePermissions({
            scientificStateItems: animalScientificStateItems,
            gdprStateItems: animalGdprStateItems || {},
        }),
        human: CombinedTypePermissions({
            scientificStateItems: humanScientificStateItems,
            gdprStateItems: humanGdprStateItems || {},
        }),

    },
    required: [
        'enableMinimalReadAccess',
        'animal',
        'human',
    ]
});

module.exports = SubjectPermissions;
