import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordEditor } from './record-editor';
import { RecordCreator } from './record-creator';

const SubjectGroupTypeView = withRecordTypeView({
    RecordEditor,
    RecordCreator,
});

const SubjectGroupCollectionView = withCollectionView({
    collection: 'subjectGroup',
    RecordTypeView: SubjectGroupTypeView
});

const SubjectGroups = () => {
    return (
        <SubjectGroupCollectionView />
    );
}


export default SubjectGroups;
