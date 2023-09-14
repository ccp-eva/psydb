import React, { useState, useEffect } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { Modal, Button } from 'react-bootstrap';
import EditDefinitionForm from './edit-definition-form';

const EditDefinitionModal = ({
    show,
    onHide,
    record,
    format,
    tokens,
    availableFieldDataByPointer,
    onSuccessfulUpdate,
}) => {
    var translate = useUITranslation();

    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }
    return (
        <Modal
            show={ show }
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    { translate('Short Label when Referencing') }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <EditDefinitionForm
                    record={ record }
                    format={ format }
                    tokens={ tokens }
                    availableFieldDataByPointer={
                        availableFieldDataByPointer
                    }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default EditDefinitionModal;
