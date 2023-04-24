import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordList } from './record-list'
//import { RecordDetails } from './record-details';
import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';
import { RecordRemover } from './record-remover';


const ApiKeyCollectionView = withUntypedCollectionView({
    collection: 'apiKey',
    RecordList,
    RecordDetails: null,
    RecordCreator,
    RecordEditor,
    RecordRemover,
});

export default ApiKeyCollectionView;
