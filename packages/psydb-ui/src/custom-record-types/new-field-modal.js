import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'react-bootstrap';
import NewFieldForm from './new-field-form';

const NewFieldModal = ({ show, onHide, record, onSuccessfulUpdate }) => {
    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }
    return (
        <Modal show={show} onHide={ onHide }>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NewFieldForm
                    record={ record }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default NewFieldModal;
