import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import EditFieldForm from './edit-field-form';

const EditFieldModalBody = (ps) => {
    var { record, onSuccessfulUpdate, onHide, modalPayloadData = {}} = ps;
    var { field } = modalPayloadData;
    return (
        <EditFieldForm
            record={ record }
            field={ field }
            onSuccess={ demuxed([ onSuccessfulUpdate, onHide ]) }
        />
    );
}

const EditFieldModal = WithDefaultModal({
    title: 'Edit Field',
    size: 'lg',
    Body: EditFieldModalBody
});

export default EditFieldModal;
