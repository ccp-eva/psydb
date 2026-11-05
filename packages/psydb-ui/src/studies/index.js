import React from 'react';
import { withCollectionView, withRecordTypeView }
    from '@mpieva/psydb-ui-lib/src/generic-views';

import IntraTypeRouting from './intra-type-routing'

import { RecordDetails } from './record-details';
import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';
import { RecordRemover } from './record-remover';


import ExtendedSearch from './extended-search';

const StudyTypeView = withRecordTypeView({
    CustomRouting: IntraTypeRouting,
    RecordDetails,
    RecordCreator,
    RecordEditor,
    RecordRemover,
});

const StudyCollectionView = withCollectionView({
    collection: 'study',
    RecordTypeView: StudyTypeView
});

const Studies = () => {
    return <StudyCollectionView />
}

export default Studies;
