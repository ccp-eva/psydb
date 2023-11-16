'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var {
    setupInternalResearchGroupIds,
    keyRoleFlagsByResearchGroupId,
    gatherResearchGroupIdsForCollections,
    gatherResearchGroupIdsForFlags,
    createFakeRootFlags,
} = require('./utils');

var PermissionsDataHolder = ({
    hasRootAccess,
    rolesByResearchGroupId,

    researchGroupIds: availableResearchGroupIds,
    researchGroups: availableResearchGroups,
    forcedResearchGroupId,
     
    availableSubjectTypes,
    availableLocationTypes,
    availableStudyTypes,
    availableLabMethods,
    availableHelperSetIds,
    availableSystemRoleIds,
}) => {
    var internal = setupInternalResearchGroupIds({
        hasRootAccess,
        availableResearchGroupIds,
        forcedResearchGroupId,
    });

    var flagsByResearchGroupId = (
        hasRootAccess && forcedResearchGroupId
        ? { [forcedResearchGroupId]: createFakeRootFlags() }
        : (
            keyRoleFlagsByResearchGroupId({
                availableResearchGroupIds,
                rolesByResearchGroupId
            })
        )
    );

    // FIXME: somehow this triggers in frontend if 'availableResearchGroups'
    // is ommitted
    if (hasRootAccess && forcedResearchGroupId && availableResearchGroups) {
        ({
            subjectTypes: availableSubjectTypes = [],
            locationTypes: availableLocationTypes = [],
            studyTypes: availableStudyTypes = [],
            labMethods: availableLabMethods = [],
            helperSetIds: availableHelperSetIds = [],
        } = (
            availableResearchGroups.find(it => (
                compareIds(it._id, forcedResearchGroupId)
            )).state
        ))
    }

    //console.log({
    //    availableSubjectTypes,
    //    availableLocationTypes,
    //    availableStudyTypes,
    //    availableLabMethods,
    //});

    var researchGroupIdsByCollection = (
        gatherResearchGroupIdsForCollections({
            researchGroupIds: internal.actualIds,
            flagsByResearchGroupId,
        })
    );

    var researchGroupIdsByFlag = (
        gatherResearchGroupIdsForFlags({
            researchGroupIds: internal.actualIds,
            flagsByResearchGroupId,
        })
    )

    var permissions = {
        hasRootAccess,
        rolesByResearchGroupId,
        
        availableResearchGroupIds,
        researchGroupIds: internal.actualIds, // FIXME deprecated
        userResearchGroupIds: internal.actualIds,
        forcedResearchGroupId: internal.actuallyForcedId,

        flagsByResearchGroupId,
        researchGroupIdsByCollection,
        researchGroupIdsByFlag,
        
        availableSubjectTypes,
        availableLocationTypes,
        availableStudyTypes,
        availableLabMethods,
        availableHelperSetIds,
        availableSystemRoleIds,
    };

    return permissions;
}

module.exports = PermissionsDataHolder;
