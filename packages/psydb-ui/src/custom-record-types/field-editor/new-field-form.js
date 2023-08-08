import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import MainForm from './main-form';

const NewFieldForm = (ps) => {
    var { record, onSuccess: onSuccessfulUpdate } = ps;
    var hasSubChannels = (
        record.state.settings.subChannelFields
    );

    var send = useSend((formData) => ({
        type: 'custom-record-types/add-field-definition',
        payload: {
            id: record._id,
            ...formData
        }
    }), { onSuccessfulUpdate });

    return (
        <MainForm.Component
            initialValues={{ props: {} }}
            onSubmit={ send.exec }
            hasSubChannels={ hasSubChannels }
            isUnrestricted={ true }
        />
    )
}

export default NewFieldForm;
