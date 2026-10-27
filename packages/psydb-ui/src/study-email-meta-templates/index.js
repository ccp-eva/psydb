import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import RecordDetails from './record-details';
import RecordEditor from './record-editor';
import RecordCreator from './record-creator';

const StudyEmailMetaTemplateCollectionView = withUntypedCollectionView({
    collection: 'studyEmailMetaTemplate',

    RecordDetails,
    RecordEditor,
    RecordCreator,
});

const StudyEmailMetaTemplateRouting = () => {
    return (
        <StudyEmailMetaTemplateCollectionView />
    );
}


export default StudyEmailMetaTemplateRouting;
