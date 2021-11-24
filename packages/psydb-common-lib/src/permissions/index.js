'use strict';
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
        forcedResearchGroupId,
        researchGroupIdsByFlag,
        researchGroupIdsByCollection,
    } = wrapper;

    var isRoot = () => (
        hasRootAccess && !forcedResearchGroupId
    )

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

    var hasLabOperationFlag = (type, flag) => (
        isRoot()
        ? true
        : getLabOperationFlagIds(type, flag).length > 0
    );

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

    var out = {
        ...wrapper,

        isRoot,
        getFlagIds,
        getLabOperationFlagIds,
        getCollectionFlagIds,

        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,
        hasCollectionFlag,
    }

    return out;
}

module.exports = Permissions;
