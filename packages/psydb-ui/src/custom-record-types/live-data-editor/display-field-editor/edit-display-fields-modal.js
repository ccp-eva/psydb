import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'react-bootstrap';
import EditDisplayFieldsForm from './edit-display-fields-form';

const EditDisplayFieldsModal = ({
    show,
    onHide,
    record,
    target,
    currentDataPointers,
    availableFieldDataByPointer,
    onSuccessfulUpdate,
}) => {
    target = target || 'table';

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
                    {(
                        target === 'optionlist'
                        ? 'Optionsfelder'
                        : 'Tabellenfelder'
                    )} bearbeiten
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <EditDisplayFieldsForm
                    target={ target }
                    record={ record }
                    currentDataPointers={ currentDataPointers }
                    availableFieldDataByPointer={
                        availableFieldDataByPointer
                    }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default EditDisplayFieldsModal;
