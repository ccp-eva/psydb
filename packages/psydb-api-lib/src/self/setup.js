'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
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

    var _systemRoleIds = [];
    var _researchGroupIds = [];
    for (var it of researchGroupSettings) {
        _systemRoleIds.push(it.systemRoleId);
        _researchGroupIds.push(it.researchGroupId);
    }
    
    var roles = await withRetracedErrors(
        db.collection('systemRole')
        .find({ _id: { $in: _systemRoleIds } })
        .toArray()
    );

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

    if (roles.length > 0) {
        var rolesById = keyBy({
            items: roles,
            byProp: '_id'
        });

        for (var it of researchGroupSettings) {
            var {
                researchGroupId: gid,
                systemRoleId: rid
            } = it;

            self.rolesByResearchGroupId[gid] = rolesById[rid];
        }
    }
}

var setupAvailableCRTsAndMethods = async ({ db, self }) => {
    self.availableSubjectTypes = unique({
        from: reduceCRTs({
            items: self.researchGroups,
            pointer: '/state/subjectTypes'
        }),
        transformOption: (it) => (it.key)
    })
    self.availableLocationTypes = unique({
        from: reduceCRTs({
            items: self.researchGroups,
            pointer: '/state/locationTypes'
        }),
        transformOption: (it) => (it.key)
    });
    self.availableStudyTypes = unique({
        from : reduceCRTs({
            items: self.researchGroups,
            pointer: '/state/studyTypes'
        }),
        transformOption: (it) => (it.key)
    });

    self.availableLabMethods = unique(reduceCRTs({
        items: self.researchGroups,
        pointer: '/state/labMethods'
    }));
}

var setupAvailableHelperSetIds = async ({ db, self }) => {
    self.availableHelperSetIds = self.researchGroups.reduce((acc, it) => ([
        ...acc, ...(it.state.helperSetIds || [])
    ]), [])
}
var setupAvailableSystemRoleIds = async ({ db, self }) => {
    self.availableSystemRoleIds = self.researchGroups.reduce((acc, it) => ([
        ...acc, ...(it.state.systemRoleIds || [])
    ]), [])
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
