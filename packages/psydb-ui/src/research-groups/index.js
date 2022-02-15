import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordEditor } from './record-editor';
import { RecordCreator } from './record-creator';

const ResearchGroupTypeView = withRecordTypeView({
    RecordEditor,
    RecordCreator,
});

const ResearchGroupCollectionView = withCollectionView({
    collection: 'researchGroup',
    RecordTypeView: ResearchGroupTypeView
});

const ResearchGroups = () => {
    return (
        <ResearchGroupCollectionView />
    );
}


export default ResearchGroups;
