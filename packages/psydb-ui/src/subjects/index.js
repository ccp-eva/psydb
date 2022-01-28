import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import Details from './details';
import IntraTypeRouting from './intra-type-routing'
import { RecordEditor } from './record-editor';

const SubjectTypeView = withRecordTypeView({
    RecordEditor,
    RecordDetails: Details,
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
