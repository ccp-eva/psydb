'use strict';
var jsonpointer = require('jsonpointer');

var gatherResearchGroupIdsForCollections = (options) => {
    var {
        researchGroupIds,
        flagsByResearchGroupId,
    } = options;

    var gathered = {};
    for (var collection of allCollections) {
        gathered[collection] = filterResearchGroupsByPermissionFlags({
            collection,
            researchGroupIds,
            flagsByResearchGroupId,
        }) 
    }

    return gathered;
}

var filterResearchGroupsByPermissionFlags = (options) => {
    var {
        collection,
        researchGroupIds,
        flagsByResearchGroupId,
    } = options;

    var possibleFlagPointersByAction = {
        read: getCollectionReadFlagPointers({ collection }),
        write: getCollectionWriteFlagPointers({ collection }),
    }

    var out = {};
    for (var action of Object.keys(possibleFlagPointersByAction)) {
        var possibleFlagPointers = possibleFlagPointersByAction[action];

        var filteredIds = researchGroupIds.filter(gid => {
            var flags = flagsByResearchGroupId[gid];
            var anyAllowed = checkFlagPointers({ flags, possibleFlagPointers });
            return anyAllowed;
        });
        
        out[action] = filteredIds
    }

    return out;
}

var getCollectionReadFlagPointers = ({ collection }) => {
    switch (collection) {
        case 'subject':
            return [ '/canReadSubjects', '/canWriteSubjects' ];
        case 'study':
            return [
                '/canReadStudies', '/canWriteStudies',
                // TODO: reservation needs a separate endpoint to
                // get study name/summary
                '/labOperation/inhouse/canWriteReservations',
                '/labOperation/away-team/canWriteReservations',
                '/labOperation/online-video-call/canWriteReservations',
            ];
        case 'personnel':
            return [ '/canWritePersonnel' ];

        case 'externalPerson':
        case 'externalOrganization':
        case 'helperSet':
        case 'helperSetItem':
        case 'location':
        case 'studyTopic':
            return [ '/canWriteAdministrativeCollections' ]

        default:
            return []
    }
}

var getCollectionWriteFlagPointers = ({ collection }) => {
    switch (collection) {
        case 'subject':
            return [ '/canWriteSubjects' ];
        case 'study':
            return [ '/canWriteStudies' ];
        case 'personnel':
            return [ '/canWritePersonnel' ];

        case 'externalPerson':
        case 'externalOrganization':
        case 'helperSet':
        case 'helperSetItem':
        case 'location':
        case 'studyTopic':
            return [ '/canWriteAdministrativeCollections' ]

        default:
            return []
    }
}

var checkFlagPointers = ({ flags, possibleFlagPointers }) => {
    var areAnyTrue = false;
    for (var pointer of possibleFlagPointers) {
        if (jsonpointer.get(flags, pointer) === true) {
            areAnyTrue = true;
            break;
        }
    }
    return areAnyTrue;
}

// FIXME: where can we best put this for reuse ...
// PS: it includes customRecordType, systemRole and others
// while schema-enums doesnt
var allCollections = [
    // dont have system permissions
    // they depend on what study they belong to
    'ageFrame',
    'experimentVariant',
    'experimentVariantSetting',
    'experimentOperatorTeam',
    'subjectSelector',

    // dont have system permissions
    // they depend on what study they belong to and also if user has
    // calendar access
    'experiment',
    'reservation',
   
    // theese can only be sritten by root users
    // but the at leas have to be selectable for all users in dropdowns
    // since we need them to be able to setup systemPermissions of
    // other records
    'researchGroup',
    
    // theese can only be accessed by root users
    'customRecordType',
    'systemRole',

    // theese fall under administrativecollections
    // need to be listable for other records
    // ...
    // on create only of your research group
    // on edit all the ones that are already there + the ones
    // of your researchgroup .... search for fk needs to handle that
    'externalPerson',
    'externalOrganization',
    'helperSet',
    'helperSetItem',
    'location',
    'studyTopic',

    // theese have special read/write flags
    // but the same stuff about search for fk applies here
    'personnel',
    'study',
    'subject',
];

module.exports = { gatherResearchGroupIdsForCollections };
