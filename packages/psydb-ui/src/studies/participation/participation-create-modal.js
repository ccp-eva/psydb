import React, { useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';

import ParticipationCreateForm from './participation-create-form';

const ParticipationCreateModal = ({
    show,
    onHide,
    studyId,
    subjectRecordType,
    onSuccessfulCreate
}) => {

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'subject/add-manual-participation',
            payload: {
                ...formData,
                studyId
            }
        };

        agent.send({ message }).then(response => {
            onHide();
            onSuccessfulCreate && onSuccessfulCreate(response);
        })
    }

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Probdanden hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <ParticipationCreateForm { ...({
                        subjectRecordType,
                        onSubmit: handleSubmit
                    })} />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ParticipationCreateModal;
