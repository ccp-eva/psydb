import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

import CreateNewType from './create-new-type';
import EditorContainer from './editor-container';
import RemoveType from './remove';

const RecordCreator = (ps) => {
    var { onSuccessfulUpdate } = ps;
    return (
        <CreateNewType onCreated={ onSuccessfulUpdate } />
    );
}

const RecordRemover = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <RemoveType
            successInfoBackLink={ successInfoBackLink }
        />
    )
}

const RecordList = (ps) => {
    return (
        <RecordListContainer
            { ...ps }
            searchOptions={{
                enableResearchGroupFilter: false
            }}
            defaultSort={{
                path: 'state.label',
                direction: 'asc',
            }}
        />
    );
}

const CRTCollectionView = withUntypedCollectionView({
    collection: 'customRecordType',
    RecordList,
    RecordEditor: EditorContainer,
    RecordCreator,
    RecordRemover,
});

const CustomRecordTypes = () => {
    return (
        <CRTCollectionView />
    )
}

export default CustomRecordTypes;
