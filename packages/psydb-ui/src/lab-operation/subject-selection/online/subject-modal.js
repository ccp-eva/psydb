import React, { useState, useEffect, useReducer } from 'react';

import {
    Modal
} from 'react-bootstrap';

import { TabNav } from '@mpieva/psydb-ui-layout';
import SubjectModalDetails from './subject-modal-details';

const SubjectModal = ({
    show,
    onHide,
    modalPayloadData,

    studyRecordType,
    subjectRecordType,
}) => {
    if (!show) {
        return null;
    }

    var { record } = modalPayloadData;

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <SubjectModalDetails
                    recordType={ subjectRecordType }
                    id={ record._id }
                />

            </Modal.Body>
        </Modal>
    );
}

export default SubjectModal;
