import React, { useContext, useMemo } from 'react';
import { Permissions } from '@mpieva/psydb-common-lib';
import { SelfContext } from '@mpieva/psydb-ui-contexts';

const usePermissions = () => {
    var { permissions } = useContext(SelfContext);
   
    var wrappedPermissions = useMemo(() => (
        Permissions({ raw: permissions })
    ), [ permissions ]);
    
    var {
        isRoot,
        
        getFlagIds,
        getLabOperationFlagIds,

        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,

        ...raw
    } = wrappedPermissions;

    return {
        raw,

        isRoot,
        getFlagIds,
        getLabOperationFlagIds,
        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,
    }
}

export default usePermissions;
