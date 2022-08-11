import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordDetails } from './record-details';
import { RecordCreator } from './record-creator';
import EditorContainer from './editor-container';

const ExternalPersonTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
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
