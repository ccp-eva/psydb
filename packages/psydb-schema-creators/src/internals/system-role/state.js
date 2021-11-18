'use strict';
var inline = require('@cdxoo/inline-text');
    //CollectionPermission = require('./collection-permission'),
    //systemPermissionsSchema = require('../system-permissions-schema');

var {
    ExactObject,
    SaneString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var administrativeFlags = require('./administrative-flags');
var studyCollectionFlags = require('./study-collection-flags');
var subjectCollectionFlags = require('./subject-collection-flags');
var participationFlags = require('./participation-flags');
var labOperationFlags = require('./lab-operation-flags');

var SystemRoleState = ({
    //    schemaTree
} = {}) => {
    var schema = ExactObject({
        systemType: 'SystemRoleState',
        properties: {
            name: SaneString({
                title: 'Bezeichnung',
                minLength: 1,
            }),
            ...administrativeFlags,
            ...studyCollectionFlags,
            ...subjectCollectionFlags,
            ...participationFlags,
            ...labOperationFlags,
        },
        required: [
            'name',
            ...Object.keys(administrativeFlags),
            ...Object.keys(studyCollectionFlags),
            ...Object.keys(subjectCollectionFlags),
            ...Object.keys(participationFlags),
            ...Object.keys(labOperationFlags),
        ],
    });

    return schema;
};

module.exports = SystemRoleState;
