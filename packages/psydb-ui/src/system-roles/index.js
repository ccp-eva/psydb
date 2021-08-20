import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const SystemRoleCollectionView = withCollectionView({
    collection: 'systemRole',
});

const SystemRoles = () => {
    return (
        <SystemRoleCollectionView />
    );
}


export default SystemRoles;
