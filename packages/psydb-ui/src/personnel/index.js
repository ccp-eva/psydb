import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordDetails } from './record-details';
import { RecordEditor } from './record-editor';
import { RecordCreator } from './record-creator';
import { RecordRemover } from './record-remover';

const PersonnelTypeView = withRecordTypeView({
    RecordDetails,
    RecordEditor,
    RecordCreator,
    RecordRemover,
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
