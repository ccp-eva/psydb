import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';
import { RecordDetails } from './record-details';

const ExternalOrganizationTypeView = withRecordTypeView({
    RecordDetails,
    RecordCreator,
    RecordEditor,
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
