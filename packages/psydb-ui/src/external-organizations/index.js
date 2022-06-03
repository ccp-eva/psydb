import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordDetails } from './record-details';
import { RecordRemover } from './record-remover';

import EditorContainer from './editor-container';

const ExternalOrganizationTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
    RecordRemover,
});

const ExternalOrganizationCollectionView = withCollectionView({
    collection: 'externalOrganization',
    RecordTypeView: ExternalOrganizationTypeView,
});

const ExternalOrganizations = () => {
    return (
        <ExternalOrganizationCollectionView />
    );
}


export default ExternalOrganizations;
