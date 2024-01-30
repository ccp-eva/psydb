import React from 'react';

import {
    withUntypedCollectionView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordDetails } from './record-details';
import { RecordEditor } from './record-editor';
import { RecordCreator } from './record-creator';

const SystemRoleCollectionView = withUntypedCollectionView({
    collection: 'systemRole',

    RecordDetails,
    RecordEditor,
    RecordCreator,
});

const SystemRoles = () => {
    return (
        <SystemRoleCollectionView />
    );
}


export default SystemRoles;
