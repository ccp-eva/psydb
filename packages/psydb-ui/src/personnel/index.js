import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';

import { RecordEditor } from './record-editor';

const PersonnelTypeView = withRecordTypeView({
    RecordEditor
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
