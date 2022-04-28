import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordDetails } from './record-details';
import { RecordEditor } from './record-editor';
import { RecordCreator } from './record-creator';

const SystemRoleTypeView = withRecordTypeView({
    RecordDetails,
    RecordEditor,
    RecordCreator,
});

const SystemRoleCollectionView = withCollectionView({
    collection: 'systemRole',
    RecordTypeView: SystemRoleTypeView
});

const SystemRoles = () => {
    return (
        <SystemRoleCollectionView />
    );
}


export default SystemRoles;
