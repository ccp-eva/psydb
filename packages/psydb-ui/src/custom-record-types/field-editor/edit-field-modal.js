import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'react-bootstrap';
import EditFieldForm from './edit-field-form';

const EditFieldModal = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        record,
        onSuccessfulUpdate
    } = ps;

    var { field } = (modalPayloadData || {});

    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }

    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Feld Bearbeiten</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <EditFieldForm
                    record={ record }
                    field={ field }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default EditFieldModal;
