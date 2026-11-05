import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

//import { RecordDetails } from './record-details';
import RecordEditor from './record-editor';
import RecordCreator from './record-creator';

const StudyConsentTemplateCollectionView = withUntypedCollectionView({
    collection: 'studyConsentTemplate',

    //RecordDetails,
    RecordEditor,
    RecordCreator,
});

const StudyConsentTemplateRouting = () => {
    return (
        <StudyConsentTemplateCollectionView />
    );
}


export default StudyConsentTemplateRouting;
