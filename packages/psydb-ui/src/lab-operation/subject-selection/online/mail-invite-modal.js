import React, { useState, useEffect, useReducer } from 'react';

import {
    Modal
} from 'react-bootstrap';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';

const MailInviteModal = ({
    show,
    onHide,
    studyRecordType,
    subjectRecordType,
    subjectModalData,
}) => {
    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Mails Senden</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                hallo
            </Modal.Body>
        </Modal>
    );
}

export default MailInviteModal;
