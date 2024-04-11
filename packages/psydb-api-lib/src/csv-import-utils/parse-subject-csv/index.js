'use strict';
var { sift } = require('@mpieva/psydb-common-lib');
var { UnknownCSVColumnKeys } = require('../errors');
var { deserializers } = require('../common');
//var dumbParseCSV = require('../dumb-parse-csv');

var isUnsupportedType = (systemType) => {
    return [
        'ListOfObjects',
    ].includes(systemType)
}

var parseSubjectCSV = (bag) => {
    var { data, subjectCRT } = bag;
    
    var definitions = {
        ...subjectCRT.allCustomFields(),
        ...extraDefinitions
    };

    var { csvColumns, csvLines } = dumbParseCSV(data);

    var mapping = createCSVColumnMapping({
        definitions, csvColumns
    });

    var out = [];
    for (var linedata of lines) {
        var parsedline = [];
        for (var entry of linedata.entries()) {
            var [ ix, value ] = entry;
            var { definition, realKey, extraPath } = mapping[ix];
            var { systemType, pointer } = definition;

            var fullPointer = [ pointer, ...extraPath ].join('/');
            if (isUnsupportedType(systemType)) {
                // FIXME
                throw new Error('unsupported field type');
            }
            var deserialize = deserializers[systemType] || ((v) => (v));
            parsedline.push({
                definition, realKey, extraPath,
                value: deserialize({
                    value: String(value).trim(),
                    definition
                })
            });
        }
        out.push(parsedline);
    }

    return out;
}

var createCSVColumnMapping = (bag) => {
    var { subjectCRT, csvColumns } = bag;

    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of csvColumns.entries()) {
        var [ ix, csvColumnKey ] = entry;

        var tokens = csvColumnKey.split(/\./);
        var [ realKey, ...extraPath ] = tokens;

        // FIXME: only when testing permissiions are enabled
        if (realKey === 'testingPermissions') {
            infos.push({
                definition: {
                    pointer: '/scientific/state/testingPermissions'
                },
                realKey, extraPath
            });
        }
        else if (realKey === 'comment') {
            infos.push({
                definition: { pointer: '/scientific/state/comment' },
                realKey, extraPath
            });
        }
        else {
            var found = subjectCRT.findCustomFields({ key: realKey });

            if (found < 1) {
                unknownCSVColumnKeys.push(realKey)
            }
            else if (found > 1) {
                throw new Error(
                    `multiple fields match column key "${realKey}"`
                );
            }
            else {
                infos.push({ definition: found[0], realKey, extraPath });
            }
        }
    }

    if (unknownCSVColumnKeys.length > 0) {
        throw new UnknownCSVColumnKeys(unknownCSVColumnKeys);
    }

    return infos;
}

var extraDefinitions = [
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

module.exports = parseSubjectCSV;
