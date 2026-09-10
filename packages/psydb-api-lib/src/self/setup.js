'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { keyBy, entries, compareIds, unique } = require('@mpieva/psydb-core-utils');
var { keyRecords } = require('@mpieva/psydb-common-lib');

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
    var researchGroups = await aggregateToArray({ db, researchGroup: (
        self.hasRootAccess
        ? {}
        : { '_id': { $in: _researchGroupIds }}
    )})
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

    var roles = await aggregateToArray({ db, systemRole: {
        '_id': { $in: Object.values(userRoleIdsByGID) }
    }});

    var rolesById = keyRecords(roles);
    for (var [ gid, roleId] of entries(userRoleIdsByGID)) {
        self.rolesByResearchGroupId[gid] = rolesById[roleId];
    }
}

var setupAvailableCRTsAndMethods = async ({ db, self }) => {
    var researchGroups = getActiveResearchGroups({ self });
    
    self.availableSubjectTypes = gatherCRTRefKeys({
        from: researchGroups,
        pointer: '/state/subjectTypes'
    });
    self.availableLocationTypes = gatherCRTRefKeys({
        from: researchGroups,
        pointer: '/state/locationTypes'
    });
    self.availableStudyTypes = gatherCRTRefKeys({
        from: researchGroups,
        pointer: '/state/studyTypes'
    });
    self.availableExternalOrganizationTypes = gatherCRTRefKeys({
        from: researchGroups,
        pointer: '/state/externalOrganizationTypes'
    });
    self.availableExternalPersonTypes = gatherCRTRefKeys({
        from: researchGroups,
        pointer: '/state/externalPersonTypes'
    });

    self.availableLabMethods = unique(gatherPointerValuesFromList({
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

var gatherCRTRefKeys = (bag) => {
    var { from, pointer } = bag;

    var out = unique({
        from: gatherPointerValuesFromList({ items: from, pointer }),
        transformOption: (it) => (it.key)
    });

    return out;
}


var jsonpointer = require('jsonpointer')
var { unique, arrify } = require('@mpieva/psydb-core-utils');

// FIXME: maybe better name; it used to be called 'reduceCRTs' which worse
// unionize() ???
var gatherPointerValuesFromList = (bag) => {
    var { items, pointer = '/' } = bag;
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
