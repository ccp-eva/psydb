import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';

const ExternalPersonTypeView = withRecordTypeView({
    RecordCreator,
    RecordEditor,
});

const ExternalPersonCollectionView = withCollectionView({
    collection: 'externalPerson',
    RecordTypeView: ExternalPersonTypeView,
});

const ExternalPersons = () => {
    return (
        <ExternalPersonCollectionView />
    );
}


export default ExternalPersons;
