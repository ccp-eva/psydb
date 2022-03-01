import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import Details from './details';
import IntraTypeRouting from './intra-type-routing'

import {
    RecordCreator,
    RecordEditor,
    RecordDetails,
    RecordRemover
} from '@mpieva/psydb-ui-record-views/subjects';

//import { RecordCreator } from './record-creator';
//import { RecordEditor } from './record-editor';

const SubjectTypeView = withRecordTypeView({
    RecordCreator,
    RecordEditor,
    RecordDetails: Details,
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
