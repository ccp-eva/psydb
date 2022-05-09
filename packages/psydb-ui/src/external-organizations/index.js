import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';
import { RecordDetails } from './record-details';
import { RecordRemover } from './record-remover';

const ExternalOrganizationTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor,
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
