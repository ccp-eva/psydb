import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import EditExtraIdFieldsForm from './edit-extra-id-fields-form';

const EditExtraIdFieldsModalBody = (ps) => {
    var { _id, crt, onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { importSettings = {} } = crt.getRaw();
    var { extraIdFields = [] } = importSettings;
    
    var send = useSend((formData) => ({
        type: 'custom-record-types/import-settings/set-extra-id-fields',
        payload: {
            _id,
            values: formData.extraIdFields.map(it => ({ pointer }))
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });
    
    var initialValues = {
        extraIdFields: extraIdFields.map(it => it.pointer)
    }
    return (
        <>
            <EditExtraIdFieldsForm
                crt={ crt } initialValues={ initialValues }
                { ...send.passthrough }
            />
        </>
    )
}

const EditExtraIdFieldsModal = WithDefaultModal({
    title: 'Extra Import Ids',
    size: 'lg',
    Body: EditExtraIdFieldsModalBody
});

export default EditExtraIdFieldsModal
