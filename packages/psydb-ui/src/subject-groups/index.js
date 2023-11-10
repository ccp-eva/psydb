import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordList } from './record-list'
import { RecordDetails } from './record-details';
import { RecordCreator } from './record-creator';
import { RecordEditorContainer } from './record-editor-container';
import { RecordRemover } from './record-remover';

const SubjectGroupCollectionView = withUntypedCollectionView({
    collection: 'subjectGroup',
    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor: RecordEditorContainer,
    RecordRemover,
});

export default SubjectGroupCollectionView;
