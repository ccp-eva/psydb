import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const ExternalOrganizationCollectionView = withCollectionView({
    collection: 'externalOrganization',
});

const ExternalOrganizations = () => {
    return (
        <ExternalOrganizationCollectionView />
    );
}


export default ExternalOrganizations;
