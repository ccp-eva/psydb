import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import HelperSetRouting from './helper-set-routing';
import {
    RecordCreator,
    RecordEditorContainer,
    RecordList,
    RecordRemover
} from './sets';


const HelperSetTypeView = withRecordTypeView({
    RecordDetails: null,
    RecordCreator,
    RecordEditor: RecordEditorContainer,
    RecordList,
    RecordRemover,
    CustomRouting: HelperSetRouting,
});

const HelperSetCollectionView = withCollectionView({
    collection: 'helperSet',
    RecordTypeView: HelperSetTypeView
});

const HelperSets = () => {
    return (
        <HelperSetCollectionView />
    );
}

export default HelperSets;
