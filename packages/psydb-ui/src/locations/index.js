import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const LocationCollectionView = withCollectionView({
    collection: 'location',
});

const Locations = () => {
    return (
        <LocationCollectionView />
    );
}

export default Locations;
