'use strict';
var ApiError = require('./api-error');

var verifyReadRecordAllowed = (options) => {
    var {
        collection,
        record,
        permissions
    } = options;

    var {
        hasRootAccess,
        projectedResearchGroupIds
    } = permissions;

    if (hasRootAccess) {
        // root users can always do that
        // SystemPermissionStages() in query takes care
        // of foredResearchGroupId without any further
        // checks required
        return;
    }

    if (record) {
        var { systemPermissions } = (
            record.scientific
            ? record.scientific.state
            : record.state
        );
    }

    var researchGroupPermissions = projectedResearchGroups.map(gid => (
        permissions.byResearchGroupId[gid]
    ));

    var possibleFlagKeys = getCollectionFlagKeys({ collection });
    
    var anyAllowed = false;
    for (var flags of researchGroupPermissions) {
        anyAllowed = checkFlagKeys({ flags, possibleFlagKeys });
        if (anyAllowed) {
            break;
        }
    }

    if (!anyAllowed) {
        throw new ApiError(403, {
            apiStatus: 'ReadRecordDenied',
            data: {
                possibleFlags: possibleFlagKeys
            }
        })
    }
}

var getCollectionFlagKeys = ({ collection }) => {
    switch (collection) {
        case 'subject':
            return [ 'canReadSubjects', 'canWriteSubjects' ];
        case 'study':
            return [ 'canReadStudies', 'canWriteStudies' ];
        case 'personnel':
            return [ 'canWritePersonnel' ];

        case 'researchGroup':
        case 'systeRole':
        case 'customRecordType':
            return [];

        default:
            return [ 'canWriteAdministrativeCollections' ]
    }
}

var checkFlagKeys = ({ flags, possibleFlagKeys }) => {
    var areAnyTrue = false;
    for (var key of possibleFlagKeys) {
        if (flags[key] === true) {
            areAnyTrue = true;
            break;
        }
    }
    return areAnyTrue;
}

module.exports = verifyReadRecordAllowed;
