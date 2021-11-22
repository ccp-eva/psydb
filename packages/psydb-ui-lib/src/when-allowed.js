import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

export const WhenAllowed = (ps) => {
    var {
        isRoot,
        
        flag,
        flags,
        
        labType,
        labTypes,
        labFlag,
        labFlags,

        children,
    } = ps;

    if (flag) {
        flags = [ flag ];
    }
    if (labFlag) {
        labFlags = [ labFlag ];
    }
    if (labType) {
        labTypes = [ labType ];
    }

    var permissions = usePermissions();
    var isAllowed = false;

    if (isRoot && permissions.isRoot()) {
        isAllowed = true;
    }
    else {
        if (flags && !isAllowed) {
            isAllowed = permissions.hasSomeFlags(flags);
        }
        if (labFlags && !isAllowed) {
            isAllowed = permissions.hasSomeLabOperationFlags({
                types: labTypes || 'any',
                flags: labFlags
            });
        }
    }

    if (!isAllowed) {
        return null
    }
    else {
        return <>{ children }</>
    }
}
