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

    var hasFlag = (flag) => (
        isRoot()
        ? true
        : (
            researchGroupIdsByFlag[flag] &&
            researchGroupIdsByFlag[flag].length > 0
        )
    );

    var hasSomeFlags = (flags) => (
        flags.some(it => hasFlag(it))
    );

    var hasLabOperationFlag = (type, flag) => {
        if (isRoot()) {
            return true;
        }
        else {
            var { labOperation } = researchGroupIdsByFlag;
            if (
                labOperation &&
                labOperation[type] &&
                labOperation[type][flag]
            ) {
                return labOperation[type][flag].length > 0
            }
        }

        return false;
    }

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
