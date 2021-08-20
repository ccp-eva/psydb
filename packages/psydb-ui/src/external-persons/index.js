import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const ExternalPersonCollectionView = withCollectionView({
    collection: 'externalPerson',
});

const ExternalPersons = () => {
    return (
        <ExternalPersonCollectionView />
    );
}


export default ExternalPersons;
