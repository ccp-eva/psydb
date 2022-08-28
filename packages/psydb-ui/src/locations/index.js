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

import EditorContainer from './editor-container';


const LocationTypeView = withRecordTypeView({
    RecordList: (ps) => {
        var { url, collection, recordType } = ps;
        return (
            <RecordListContainer
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }
                enableView={ false }
                enableCSVExport={ true }
                enableNew={ true }
                enableEdit={ false }
                enableRecordRowLink={ true }
            />
        );
    },
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
