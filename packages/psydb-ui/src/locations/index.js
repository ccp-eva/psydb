import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const LocationCollectionView = withCollectionView({
    collection: 'location',
});

const Locations = () => {
    return (
        <LocationCollectionView />
    );
}

export default Locations;
