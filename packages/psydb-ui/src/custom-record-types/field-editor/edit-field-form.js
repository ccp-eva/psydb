import React from 'react';
import { omit, only } from '@mpieva/psydb-core-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

const EditFieldForm = (ps) => {
    var { record, field, onSuccess: onSuccessfulUpdate } = ps;
    var hasSubChannels = (
        record.state.settings.subChannelFields
    );

    var send = useSend((formData) => ({
        type: 'custom-record-types/patch-field-definition',
        payload: {
            id: record._id,
            fieldKey: field.key,
            ...formData
        }
    }), { onSuccessfulUpdate });

    // FIXME: im confused about why subchannelkey is 
    // th that specific place; check api or create and patch handler
    return (
        <MainForm.Component
            initialValues={{
                subChannelKey: field.subChannelKey,
                props: omit({ from: field, paths: [
                    'isNew', 'isDirty', 'subChannelKey'
                ] })
            }}
            onSubmit={ send.exec }
            hasSubChannels={ hasSubChannels }
            isUnrestricted={ false }
            // TODO
            //isUnrestricted={ field.isNew }
        />
    )
}

export default EditFieldForm;
