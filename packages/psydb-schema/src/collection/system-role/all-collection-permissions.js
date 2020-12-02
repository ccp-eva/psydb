'use strict';
var SubjectPermissions = require('./subject-permissions');

var AllCollectionPermissions = ({
    schemaTree
}) => ({
    type: 'object',
    properties: {
        subject: SubjectPermissions({
            schemaTreeNodes: schemaTree.subject.children
        }),
        /*location: LocationPermissions({
            schemaTreeNodes: schemaTree.location.children
        }),*/
    },
    required: [
        'subject',
        'location',
        'personnel',
    ]
});

module.exports = AllCollectionPermissions;
