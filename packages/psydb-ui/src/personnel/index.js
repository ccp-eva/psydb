import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const PersonnelCollectionView = withCollectionView({
    collection: 'personnel',
});

const Personnel = () => {
    return (
        <PersonnelCollectionView />
    );
}


export default Personnel;
