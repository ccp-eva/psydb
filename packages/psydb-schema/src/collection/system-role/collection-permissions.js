'use strict';
var RecordAccess = require('./record-access'),
    FieldAccess = require('./field-access');

// TODO: we can generate the individual collection
// specific schemas if we wanted to
// via params collecton + typeTree
var CollectionPermissions = ({
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
    },
    required: [
        'subject',
        'location',
        'personnel',
    ]
});

module.exports = CollectionPermissions;
