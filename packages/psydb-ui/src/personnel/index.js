import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordDetails } from './record-details';
import { RecordCreator } from './record-creator';
import { RecordRemover } from './record-remover';
import { RecordAnonymizer } from './record-anonymizer';

import EditorContainer from './editor-container';

const PersonnelTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
    RecordRemover,

    RecordAnonymizer,
})

const PersonnelCollectionView = withCollectionView({
    collection: 'personnel',
    RecordTypeView: PersonnelTypeView
});

const Personnel = () => {
    return (
        <PersonnelCollectionView />
    );
}


export default Personnel;
