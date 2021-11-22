import React, { useContext, useMemo } from 'react';
import { SelfContext } from '@mpieva/psydb-ui-contexts';

var anyLabOperationTypes = [
    'inhouse', 
    'away-team',
    'online-video-call',
    'online-survey'
];

var createCallbacks = (options) => {
    var { permissions } = options;

    var {
        hasRootAccess,
        forcedResearchGroup,
        researchGroupIdsByFlag
    } = permissions;
   
    var isRoot = () => (
        hasRootAccess && !forcedResearchGroup
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

    var researchGroupIds = () => (
        permissions.researchGroupIds
    )

    return {
        isRoot,
        researchGroupIds,
        
        getFlagIds,
        getLabOperationFlagIds,

        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,
    }
}

const usePermissions = () => {
    var { permissions } = useContext(SelfContext);
   
    var callbacks = useMemo(() => (
        createCallbacks({ permissions })
    ), [ permissions ]);

    return {
        raw: permissions,
        ...callbacks,
    }
}

export default usePermissions;
