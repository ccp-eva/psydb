import React, { useState, useEffect } from 'react';

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
    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }
    return (
        <Modal show={show} onHide={ onHide }>
            <Modal.Header closeButton>
                <Modal.Title>
                    Kurzanzeige bearbeiten
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
