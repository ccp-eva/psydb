import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordListContainer } from '@mpieva/psydb-ui-lib';

import { RecordCreator } from './record-creator';
import { RecordDetails } from './record-details';
import { RecordRemover } from './record-remover';

import EditorContainer from './editor-container';
import IntraTypeRouting from './intra-type-routing'


const LocationTypeView = withRecordTypeView({
    CustomRouting: IntraTypeRouting,
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
    RecordRemover,
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
