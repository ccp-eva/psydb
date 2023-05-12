'use strict';
var {
    entries,
    unique,
    intersect,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var DataHolder = require('./data-holder');

var anyLabOperationTypes = [
    'inhouse', 
    'away-team',
    'online-video-call',
    'online-survey'
];

var Permissions = (options) => {
    var { raw, ...rest } = options;

    var wrapper = (
        raw
        ? { ...raw }
        : { ...DataHolder(rest) }
    );

    var {
        hasRootAccess,
        userResearchGroupIds,
        forcedResearchGroupId,
        researchGroupIdsByFlag,
        researchGroupIdsByCollection,
    } = wrapper;

    var isRoot = () => (
        hasRootAccess && !forcedResearchGroupId
    )

    var getFlags = (flag) => {
        var out = {};
        for (var [ key, rgids ] of entries(researchGroupIdsByFlag)) {
            out[key] = isRoot() || (rgids.length > 0)
        }
        return out;
    }

    var getFlagIds = (flag) => (
        researchGroupIdsByFlag[flag] || []
    );

    var getLabOperationFlagIds = (type, flag) => {
        var { labOperation } = researchGroupIdsByFlag;
        return (
            (
                labOperation &&
                labOperation[type] &&
                labOperation[type][flag]
            )
            ? labOperation[type][flag]
            : []
        )
    };

    var getAllLabOperationFlagIds = ({ types, flags }) => {
        var ids = [];
        for (var type of types) {
            for (var flag of flags) {
                ids.push(...getLabOperationFlagIds(type, flag));
            }
        }
        return unique(ids);
    }

    var getCollectionFlagIds = (collection, flag) => (
        (
            researchGroupIdsByCollection[collection] &&
            researchGroupIdsByCollection[collection][flag]
        )
        ? researchGroupIdsByCollection[collection][flag]
        : []
    );

    var hasFlag = (flag) => (
        isRoot()
        ? true
        : getFlagIds(flag).length > 0
    );

    var hasSomeFlags = (flags) => (
        flags.some(it => hasFlag(it))
    );

    var hasLabOperationFlag = (type, flag, researchGroupId) => {
        if (isRoot()) {
            return true;
        }
        var ids = getLabOperationFlagIds(type, flag);
        return (
            researchGroupId
            ? !!ids.find(it => compareIds(it, researchGroupId))
            : ids.length > 0
        )
    };

    // NOTE: drop in for hasSomeLabOperationFlags
    var hasLabOpsFlags = (bag) => {
        var {
            types,
            flags,
            matchFlags = 'some',
            matchTypes = 'some',

            researchGroupId = undefined
        } = bag;
        
        var typesFN = matchTypes === 'some' ? 'some' : 'every';
        var flagsFN = matchFlags === 'some' ? 'some' : 'every';

        if (types === 'any') {
            types = anyLabOperationTypes;
        }
        
        return types[typesFN](t => (
            flags[flagsFN](f => (
                hasLabOperationFlag(t, f, researchGroupId)
            ))
        ))
    }

    var getAllowedLabOpsForFlags = (bag) => {
        var {
            onlyTypes,
            flags,
            matchFlags = 'some',
            researchGroupId = undefined
        } = bag;

        var types = onlyTypes || anyLabOperationTypes;
        var flagsFN = matchFlags === 'some' ? 'some' : 'every';

        return (types.filter(t => (
            flags[flagsFN](f => (
                hasLabOperationFlag(t, f, researchGroupId)
            ))
        )))
    }

    var hasSomeLabOperationFlags = ({ types, flags }) => {
        if (types === 'any') {
            types = anyLabOperationTypes;
        }
        return types.some(t => (
            flags.some(f => hasLabOperationFlag(t, f))
        ))
    }

    var hasCollectionFlag = (collection, flag) => (
        isRoot()
        ? true
        : getCollectionFlagIds(collection, flag).length > 0
    );

    // FIXME: since root does have no ids we need to check that seperately
    var getResearchGroupIds = (intersectIds) => (
        intersectIds
        ? intersect(intersectIds, userResearchGroupIds)
        : userResearchGroupIds
    );

    var out = {
        ...wrapper,

        isRoot,
        getFlags,
        getFlagIds,
        getLabOperationFlagIds,
        getAllLabOperationFlagIds,
        getCollectionFlagIds,
        getResearchGroupIds,

        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,
        hasCollectionFlag,
        
        getAllowedLabOpsForFlags,
        hasLabOpsFlags,
    }

    return out;
}

module.exports = Permissions;
