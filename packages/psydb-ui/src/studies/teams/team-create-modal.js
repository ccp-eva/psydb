import React, { useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import GenericRecordForm from '@mpieva/psydb-ui-lib/src/generic-record-form';

const StudyTeamCreateModal = ({
    show,
    onHide,
    onSuccessfulCreate
}) => {
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Neues Team</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <GenericRecordForm
                        type='create'
                        collection='experimentOperatorTeam'
                        onSuccessfulUpdate={ () => {
                            onHide();
                            onSuccessfulCreate && onSuccessfulCreate();
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default StudyTeamCreateModal;
