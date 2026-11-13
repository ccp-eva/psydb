import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'
import GenericRecordListContainer
    from '@mpieva/psydb-ui-lib/src/record-list-container';

//import { RecordDetails } from './record-details';
import RecordEditor from './record-editor';
import RecordCreator from './record-creator';
import { getEnabledRowClassName, getEnabledCellClassName }
    from './enabled-styles';

const RecordList = (ps) => (
    <GenericRecordListContainer
        { ...ps }
        getRowClassName={ getEnabledRowClassName }
        getCellClassName={ getEnabledCellClassName }
    />
);

const StudyConsentTemplateCollectionView = withUntypedCollectionView({
    collection: 'studyConsentTemplate',

    RecordList,

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
