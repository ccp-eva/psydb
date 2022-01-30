import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordCreator } from './record-creator';
import { RecordEditor } from './record-editor';

const ExternalOrganizationTypeView = withRecordTypeView({
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
