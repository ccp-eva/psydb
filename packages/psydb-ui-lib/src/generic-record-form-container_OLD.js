import React from 'react';
import { useParams } from 'react-router-dom';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import FormBox from './form-box';
import GenericRecordForm from './generic-record-form';

const GenericRecordFormContainer = ({
    type,
    collection,
    recordType,
    additionalPayloadProps,
    onSuccessfulUpdate,
}) => {
    var permissions = usePermissions();
    var canWrite = permissions.hasCollectionFlag(
        collection, 'write'
    );

    if (!canWrite) {
        return <PermissionDenied />
    }
    
    var id = undefined;
    if (type === 'edit') {
        ({ id } = useParams());
    }

    return (
        <FormBox title={
            type === 'edit'
            ? 'Datensatz bearbeiten'
            : 'Neuer Datensatz'
        }>
            <GenericRecordForm { ...({
                type,
                collection,
                recordType,
                id,
                additionalPayloadProps,
                onSuccessfulUpdate,
            })} />
        </FormBox>
    )
}

export default GenericRecordFormContainer;
