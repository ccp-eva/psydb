import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import HelperSetRouting from './helper-set-routing';
import HelperSetRecordActions from './helper-set-record-actions';

const HelperSetRecordList = (ps) => (
    <RecordListContainer
        { ...ps }
        CustomActionListComponent={ HelperSetRecordActions }
    />
);

const HelperSetTypeView = withRecordTypeView({
    RecordList: HelperSetRecordList,
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
