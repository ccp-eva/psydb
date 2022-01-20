import React from 'react';

import { PermissionDenied } from '@mpieva/psydb-ui-layout';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

export const withRecordCreator = (options) => {
    var { CreateForm } = options;

    var RecordCreator = (ps) => {
        var { collection, recordType } = ps;

        var permissions = usePermissions();
        var canWrite = permissions.hasCollectionFlag(
            collection, 'write'
        );

        if (canWrite) {
            return <CreateForm { ...ps } />
        }
        else {
            return <PermissionDenied />
        }
    }

    return RecordCreator;
}
