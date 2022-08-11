'use strict';
var { unique, compareIds } = require('@mpieva/psydb-core-utils');

var TestingPermissions = (value) => {
    var internals = { value };
    var self = {};

    self.intersect = (bag) => {
        var { userPermissions, researchGroupIds } = bag;

        var testingPermissions = internals.value;
        if (researchGroupIds) {
            testingPermissions = testingPermissions.filter(testing => (
                researchGroupIds.find(rg => compareIds(
                    rg, testing.researchGroupId
                ))
            ));
        }

        if (userPermissions) {
            var next = [];
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
                    next.push({
                        researchGroupId,
                        permissionList
                    })
                }
            }
            testingPermissions = next;
        }

        return TestingPermissions(testingPermissions);
    }

    self.allowedLabOps = () => {
        var out = [];
        for (var it of internals.value) {
            var { researchGroupId, permissionList } = it;
            var keys = (
                permissionList
                .filter(it => it.value === 'yes')
                .map(it => it.labProcedureTypeKey)
            )
            out.push(...keys);
        }

        out = unique(out);
        return out;
    }

    self.value = () => (
        internals.value
    );

    return self;
};

TestingPermissions.fromSubject = (subjectRecord) => (
    TestingPermissions(
        subjectRecord.scientific.state.testingPermissions
    )
);

module.exports = TestingPermissions;
