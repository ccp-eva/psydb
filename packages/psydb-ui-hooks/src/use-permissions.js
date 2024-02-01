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
    
        hasLabOpsFlags,
        gatherFlags,

        isLabMethodAvailable,
        isSubjectTypeAvailable,

        ...raw
    } = wrappedPermissions;

    return {
        raw,

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
        
        isLabMethodAvailable,
        isSubjectTypeAvailable,

        hasLabOpsFlags,
        gatherFlags,
    }
}

export default usePermissions;
