import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordDetails } from './record-details';

import EditorContainer from './editor-container';


const LocationTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
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
