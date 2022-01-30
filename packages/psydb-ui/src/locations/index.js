import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';

const LocationTypeView = withRecordTypeView({
    RecordCreator,
    RecordEditor,
});

const LocationCollectionView = withCollectionView({
    collection: 'location',
    RecordTypeView: LocationTypeView,
});

const Locations = () => {
    return (
        <LocationCollectionView />
    );
}

export default Locations;
