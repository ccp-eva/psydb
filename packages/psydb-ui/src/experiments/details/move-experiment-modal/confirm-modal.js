import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmModal = ({
    show,
    onHide,

    experimentData,
    studyData,
    confirmData,

    onSuccessfulUpdate,
}) => {
    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Experiment verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmModal;
