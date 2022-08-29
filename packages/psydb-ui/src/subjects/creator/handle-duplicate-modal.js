import React  from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';

import {
    Button,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

const HandleDuplicateModalBody = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { responseData, formikForm } = modalPayloadData;

    var handleSubmit = () => {
        formikForm.setFieldValue('$.forceDuplicate', true);
        return formikForm.submitForm().then(demuxed([
            onSuccessfulUpdate, onHide
        ]))
    };

    return (
        <div>
            <div>FOOOOOOOO</div>
            <div className='d-flex justify-content-end mt-3'>
                <Button
                    onClick={ handleSubmit }
                    variant='danger'
                >
                    Trotzdem Anlegen
                </Button>
            </div>
        </div>
    )
}

const HandleDuplicateModal = WithDefaultModal({
    title: 'Mögliche Duplikate',
    size: 'md',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: HandleDuplicateModalBody,
});

export default HandleDuplicateModal;
