import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'react-bootstrap';
import NewFieldForm from './new-field-form';

const NewFieldModal = ({ show, onHide, record, onSuccessfulUpdate }) => {
    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Neues Feld</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <NewFieldForm
                    record={ record }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default NewFieldModal;
