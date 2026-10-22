import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import RecordEditor from './record-editor';
import RecordCreator from './record-creator';

// NOTE: no details view yet; the editor is used in its place
const StudyEmailMetaTemplateCollectionView = withUntypedCollectionView({
    collection: 'studyEmailMetaTemplate',

    RecordEditor,
    RecordCreator,
});

const StudyEmailMetaTemplateRouting = () => {
    return (
        <StudyEmailMetaTemplateCollectionView />
    );
}


export default StudyEmailMetaTemplateRouting;
