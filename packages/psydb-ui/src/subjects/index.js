import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import SubjectDetailsContainer from './details';

const SubjectTypeView = withRecordTypeView({
    RecordDetails: SubjectDetailsContainer
})

const SubjectCollectionView = withCollectionView({
    collection: 'subject',
    RecordTypeView: SubjectTypeView
});

const Subjects = () => {
    return (
        <SubjectCollectionView />
    );
}

export default Subjects;
