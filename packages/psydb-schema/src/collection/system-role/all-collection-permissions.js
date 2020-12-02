'use strict';
var SubjectPermissions = require('./subject-permissions'),
    LocationPermissions = require('./location-permissions'),
    PersonnelPermissions = require('./personnel-permissions');

var AllCollectionPermissions = ({
    schemaTree
}) => ({
    type: 'object',
    properties: {
        subject: SubjectPermissions({
            schemaTreeNodes: schemaTree.subject.children
        }),
        location: LocationPermissions({
            schemaTreeNodes: schemaTree.location.children
        }),
        personnel: PersonnelPermissions({
            stateSchema: schemaTree.personnel.schemas.state
        }),
    },
    required: [
        'subject',
        'location',
        'personnel',
    ]
});

module.exports = AllCollectionPermissions;
