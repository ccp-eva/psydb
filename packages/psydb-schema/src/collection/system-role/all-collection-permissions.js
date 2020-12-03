'use strict';
var Custom = require('./util/custom-collection-permissions'),
    Fixed = require('./util/fixed-collection-permissions'),
    
    Location = require('./location-permissions');

var AllCollectionPermissions = ({
    schemaTree
}) => ({
    type: 'object',
    properties: {
        subject: Custom({
            schemaTreeNode: schemaTree.subject
        }),
        location: Location({
            schemaTreeNode: schemaTree.location
        }),
        /*study: StudyPermissions({
            schemaTreeNodes: schemaTree.study.children
        }),*/

        externalOrganization: Custom({
            schemaTreeNode: schemaTree.externalOrganization
        }),
        externalPerson: Custom({
            schemaTreeNode: schemaTree.externalPerson
        }),
        
        personnel: Fixed({
            stateSchema: schemaTree.personnel.schemas.state
        }),
    },
    required: [
        'subject',
        'location',
        'study',
        'externalOrganization',
        'externalPerson',
        'personnel',
    ]
});

module.exports = AllCollectionPermissions;
