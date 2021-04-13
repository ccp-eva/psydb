import React, { useState, useEffect } from 'react';

import GenericCollectionView from '@mpieva/psydb-ui-lib/src/generic-collection-view';

const Locations = () => {
    return (
        <GenericCollectionView collection='location' />
    );
}

export default Locations;
