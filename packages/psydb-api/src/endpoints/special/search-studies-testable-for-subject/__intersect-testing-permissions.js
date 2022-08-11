'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var intersectTestingPermissions = (bag) => {
    var {
        testingPermissions,
        researchGroupIds,
        userPermissions
    } = bag;

    if (researchGroupIds) {
        testingPermissions = testingPermissions.filter(testing => (
            researchGroupIds.find(rg => compareIds(
                rg, testing.researchGroupId
            ))
        ));
    }

    if (userPermissions) {
        testingPermissions = intersectTestingWithUser(bag);
    }

    return testingPermissions;
}

var intersectTestingWithUser = (bag) => {
    var { testingPermissions, userPermissions } = bag

    var out = [];
    for (var it of testingPermissions) {
        var { researchGroupId, permissionList } = it;
        permissionList = permissionList.filter((it) => (
            it.value === 'yes'
            && userPermissions.hasLabOperationFlag(
                it.labProcedureTypeKey,
                'canSelectSubjectsForExperiments'
            )
        ));
        if (permissionList.length > 0) {
            out.push({
                researchGroupId,
                permissionList
            })
        }
    }
    return out;
}

module.exports = intersectTestingPermissions;
