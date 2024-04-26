'use strict';
var { UnknownCSVColumnKeys } = require('../errors');
var { deserializers, parseDefinedCSV } = require('../common');

var parseLines = (bag) => {
    var { data, subjectCRT } = bag;
   
    console.log(subjectCRT.findRequiredCustomFields());


    var combinedDefinitions = [
        ...subjectCRT.allCustomFields(),
        ...commonExtraDefinitions,
        // TODO determine if testing permissions allowed
        //...testingPermissiosExtraDefinitions
    ];

    var availableCSVColumnsForDefintiions = __getAvailable({
        definitions: combinedDefinitions
    });
    
    throw new Error();
    
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

var __getAvailable = (bag) => {
    var { definitions } = bag;

    var csvColumnKeys = [];
    for (var it of definitions) {
        var defkeys = getCSVColumnKeysForSingleDefinition({
            definition: it 
        });
        if (defkeys) {
            csvColumnKeys.push(...defkeys);
        }
    }
    return csvColumnKeys;
}

var getCSVColumnKeysForSingleDefinition = (bag) => {
    var { definition } = bag;
    var { csvColumnKey, key, systemType } = definition;

    if (csvColumnKey) {
        return [ csvColumnKey ];
    }
    
    if (systemType === 'Lambda') {
        return undefined; // NOTE: skip
    }

    if (systemType === 'Address') {
        return [
            `${key}.country`,
            `${key}.city`,
            `${key}.postcode`,
            `${key}.street`,
            `${key}.housenumber`,
            `${key}.affix`,
        ];
    }
    else if (systemType === 'GeoCoords') {
        return [
            `${key}.latitude`,
            `${key}.longitude`,
        ];
    }
    else {
        return [ key ];
    }
}

module.exports = parseLines;
