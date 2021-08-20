import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

const ResearchGroupCollectionView = withCollectionView({
    collection: 'researchGroup',
});

const ResearchGroups = () => {
    return (
        <ResearchGroupCollectionView />
    );
}


export default ResearchGroups;
