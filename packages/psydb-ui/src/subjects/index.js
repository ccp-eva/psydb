import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import Creator from './creator';
import Details from './details';
import History from './history';
import Editor from './editor';
import IntraTypeRouting from './intra-type-routing'

import {
    RecordDetails,
    RecordRemover
} from '@mpieva/psydb-ui-record-views/subjects';

const SubjectTypeView = withRecordTypeView({
    RecordCreator: Creator,
    RecordEditor: Editor,
    RecordDetails: Details,
    RecordHistory: History,
    //RecordDetails,
    RecordRemover,
    CustomRouting: IntraTypeRouting,
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
