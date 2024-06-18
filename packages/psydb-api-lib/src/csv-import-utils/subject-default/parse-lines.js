'use strict';
var { FieldDefinition } = require('@mpieva/psydb-common-lib');
var { UnknownCSVColumnKeys } = require('../errors');
var { deserializers, parseDefinedCSV } = require('../common');

var parseLines = (bag) => {
    var { data, subjectCRT } = bag;
   
    var combinedDefinitions = [
        ...subjectCRT.allCustomFields(),
        ...commonExtraDefinitions,
        // TODO determine if testing permissions allowed
        //...testingPermissiosExtraDefinitions
    ];

    var available = __getAvailable({
        definitions: combinedDefinitions
    });

    var required = __getRequired({
        definitions: combinedDefinitions
    });
    
    var combinedDeserializers = {
        ...deserializers,
        ...extraDeserializers,
    }

    console.log(combinedDefinitions);

    //var out = parseDefinedCSV({
    //    csvData: data,
    //    definitions: combinedDefinitions,
    //    required: required,
    //    deserializers: combinedDeserializers,
    //    throwUnknown: true
    //});
    //
    //return out;
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
        labProcedureKey: 'online-survey',
        value,
    }),
}

var __getRequired = (bag) => {
    var { definitions } = bag;
    
    var csvColumnKeys = [];
    for (var it of definitions) {
        var def = FieldDefinition({ data: it });
        var keys = def.getRequiredCSVColumnKeys();
        if (keys) {
            csvColumnKeys.push(...keys);
        }
    }
    return csvColumnKeys;
}

var __getAvailable = (bag) => {
    var { definitions } = bag;

    var csvColumnKeys = [];
    for (var it of definitions) {
        var def = FieldDefinition({ data: it });
        var defkeys = def.getCSVColumnKeys();
        if (defkeys) {
            csvColumnKeys.push(...defkeys);
        }
    }
    return csvColumnKeys;
}

module.exports = parseLines;
