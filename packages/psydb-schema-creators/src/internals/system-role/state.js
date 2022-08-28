'use strict';
var inline = require('@cdxoo/inline-text');
    //CollectionPermission = require('./collection-permission'),
    //systemPermissionsSchema = require('../system-permissions-schema');

var {
    ExactObject,
    SaneString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var WideBool = require('./wide-bool');

var subjectCollectionFlags = require('./subject-collection-flags');
var locationCollectionFlags = require('./location-collection-flags');
var studyCollectionFlags = require('./study-collection-flags');
var studyTopicCollectionFlags = require('./study-topic-collection-flags');
var personnelCollectionFlags = require('./personnel-collection-flags');
var externalPersonCollectionFlags = require('./external-person-collection-flags');
var externalOrganizationCollectionFlags = require('./external-organization-collection-flags');
var helperSetCollectionFlags = require('./helper-set-collection-flags');

var administrativeFlags = require('./administrative-flags');
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
            
            
            ...subjectCollectionFlags,
            ...locationCollectionFlags,
            ...studyCollectionFlags,
            ...studyTopicCollectionFlags,
            ...personnelCollectionFlags,
            ...externalPersonCollectionFlags,
            ...externalOrganizationCollectionFlags,
            ...helperSetCollectionFlags,

            ...administrativeFlags,
            ...participationFlags,
            canViewReceptionCalendar: WideBool({
                title: 'kann Rezeptionskalender einsehen'
            }),
            ...labOperationFlags,

        },
        required: [
            'name',
            ...Object.keys(administrativeFlags),
            ...Object.keys(studyCollectionFlags),
            ...Object.keys(subjectCollectionFlags),
            ...Object.keys(participationFlags),
            'canViewReceptionCalendar',
            ...Object.keys(labOperationFlags),
        ],
    });

    return schema;
};

module.exports = SystemRoleState;
