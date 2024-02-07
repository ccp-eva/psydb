'use strict';
var { keyBy, entries, compareIds } = require('@mpieva/psydb-core-utils');
var withRetracedErrors = require('../with-retraced-errors');

var setup = async ({ db, self }) => {
    var {
        hasRootAccess,
        researchGroupSettings,
        internals = {}
    } = self.record.scientific.state;

    var { forcedResearchGroupId } = internals;

    self.hasRootAccess = hasRootAccess;
    self.forcedResearchGroupId = forcedResearchGroupId;

    await setupRolesAndResearchGroups({ db, self });
    await setupAvailableCRTsAndMethods({ db, self });
    await setupAvailableHelperSetIds({ db, self });
    await setupAvailableSystemRoleIds({ db, self });
}

var setupRolesAndResearchGroups = async ({ db, self }) => {
    var {
        researchGroupSettings,
    } = self.record.scientific.state;

    var _researchGroupIds = researchGroupSettings.map(it => (
        it.researchGroupId
    ));
    var researchGroups = await withRetracedErrors(
        db.collection('researchGroup')
        .find(
            self.hasRootAccess
            ? {}
            : { _id: { $in: _researchGroupIds }}
        ).toArray()
    );
    self.researchGroupIds = researchGroups.map(it => it._id);
    self.researchGroups = researchGroups;

    var userRoleIdsByGID = keyBy({
        items: researchGroupSettings,
        byProp: 'researchGroupId',
        transform: (it) => it.systemRoleId
    })

    for (var it of researchGroups) {
        var { _id: gid, state: { adminFallbackRoleId }} = it;
        if (!userRoleIdsByGID[gid] && adminFallbackRoleId) {
            userRoleIdsByGID[gid] = adminFallbackRoleId;
        }
    }

    var roles = await withRetracedErrors(
        db.collection('systemRole')
        .find({ _id: { $in: (
            Object.values(userRoleIdsByGID)
        )}})
        .toArray()
    );

    var rolesById = keyBy({
        items: roles,
        byProp: '_id'
    });

    for (var [ gid, roleId] of entries(userRoleIdsByGID)) {
        self.rolesByResearchGroupId[gid] = rolesById[roleId];
    }
}

var setupAvailableCRTsAndMethods = async ({ db, self }) => {
    var researchGroups = getActiveResearchGroups({ self });
    
    self.availableSubjectTypes = unique({
        from: reduceCRTs({
            items: researchGroups,
            pointer: '/state/subjectTypes'
        }),
        transformOption: (it) => (it.key)
    })
    self.availableLocationTypes = unique({
        from: reduceCRTs({
            items: researchGroups,
            pointer: '/state/locationTypes'
        }),
        transformOption: (it) => (it.key)
    });
    self.availableStudyTypes = unique({
        from : reduceCRTs({
            items: researchGroups,
            pointer: '/state/studyTypes'
        }),
        transformOption: (it) => (it.key)
    });

    self.availableLabMethods = unique(reduceCRTs({
        items: researchGroups,
        pointer: '/state/labMethods'
    }));
}

var setupAvailableHelperSetIds = async ({ db, self }) => {
    var researchGroups = getActiveResearchGroups({ self });
    
    self.availableHelperSetIds = researchGroups.reduce((acc, it) => ([
        ...acc, ...(it.state.helperSetIds || [])
    ]), [])
}
var setupAvailableSystemRoleIds = async ({ db, self }) => {
    var researchGroups = getActiveResearchGroups({ self });
    
    self.availableSystemRoleIds = researchGroups.reduce((acc, it) => ([
        ...acc, ...(it.state.systemRoleIds || [])
    ]), [])
}

var getActiveResearchGroups = (bag) => {
    var { self } = bag;
    var { researchGroups, forcedResearchGroupId } = self;

    if (forcedResearchGroupId) {
        researchGroups = researchGroups.filter(it => (
            compareIds(it._id, forcedResearchGroupId)
        ));
    }

    return researchGroups;
}

var jsonpointer = require('jsonpointer')
var { unique, arrify } = require('@mpieva/psydb-core-utils');

var reduceCRTs = ({ items, pointer = '/'}) => {
    var reduced = items.reduce((acc, it) => {
        var values = arrify(jsonpointer.get(it, pointer) || []);

        return [
            ...acc,
            ...values
        ];
    }, []);
    
    return reduced
}

module.exports = setup;
