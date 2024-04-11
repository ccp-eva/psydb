'use strict';
var { UnknownCSVColumnKeys } = require('../errors');
var { deserializers, parseDefinedCSV } = require('../common');

var parseLines = (bag) => {
    var { data, subjectCRT } = bag;
    
    var combinedDefinitions = [
        ...subjectCRT.allCustomFields(),
        ...commonExtraDefinitions,
        // TODO determine if testing permissions allowed
        //...testingPermissiosExtraDefinitions
    ]
    
    var combinedDeserializers = {
        ...deserializers,
        ...extraDeserializers,
    }

    var out = parseDefinedCSV({
        csvData: data,
        definitions: combinedDefinitions,
        deserializers: combinedDeserializers,
        throwUnknown: true
    });
    
    return out;
}

var testingPermissionExtraDefinitions = [
    {
        csvColumnKey: 'testingPermissions.inhouse',
        systemType: 'InhousePermissionListItem',
        pointer: '/scientific/state/testingPermissions/0/permissionList/-'
    },
    {
        csvColumnKey: 'testingPermissions.external',
        systemType: 'AwayTeamPermissionListItem',
        pointer: '/scientific/state/testingPermissions/0/permissionList/-'
    },
    {
        csvColumnKey: 'testingPermissions.onlineVideoCall',
        systemType: 'OnlineVideoCallPermissionListItem',
        pointer: '/scientific/state/testingPermissions/0/permissionList/-'
    },
    {
        csvColumnKey: 'testingPermissions.onlineSurvey',
        systemType: 'OnlineSurveyPermissionListItem',
        pointer: '/scientific/state/testingPermissions/0/permissionList/-'
    },
];

var commonExtraDefinitions = [
    {
        csvColumnKey: 'comment',
        systemType: 'FullText',
        pointer: '/scientific/state/comment'
    }
]

var extraDeserializers = {
    'InhousePermissionListItem': ({ value, definition }) => ({
        labProcedureKey: 'inhouse',
        value,
    }),
    'AwayTeamPermissionListItem': ({ value, definition }) => ({
        labProcedureKey: 'away-team',
        value,
    }),
    'OnlineVideoCallPermissionListItem': ({ value, definition }) => ({
        labProcedureKey: 'online-video-call',
        value,
    }),
    'OnlineSurveyPermissionListItem': ({ value, definition }) => ({
        labProcedureKey: 'online-video-call',
        value,
    }),
}

module.exports = parseLines;
