import React from 'react';
import { useParams } from 'react-router-dom';

import FormBox from './form-box';
import GenericRecordForm from './generic-record-form';

const GenericRecordFormContainer = ({
    type,
    collection,
    recordType,
    additionalPayloadProps,
    onSuccessfulUpdate,
}) => {
    
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
