'use strict';
var inline = require('@cdxoo/inline-text'),
    CombinedTypePermissions = require('./combined-type-permissions');

var SubjectPermissions = ({
    schemaTreeNodes,
} = {}) => {
    var { animal, human, ...other } = schemaTreeNodes;

    return ({
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
                schemaTreeNodes: animal.children
            }),
            human: CombinedTypePermissions({
                schemaTreeNodes: human.children
            }),
        },
        required: [
            'enableMinimalReadAccess',
            'animal',
            'human',
        ]
    });
};

module.exports = SubjectPermissions;
