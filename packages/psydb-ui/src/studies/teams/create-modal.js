import React, { useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import GenericRecordForm from '@mpieva/psydb-ui-lib/src/generic-record-form';

export const CreateModal = ({
    show,
    onHide,
    studyId,
    onSuccessfulCreate
}) => {
    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Neues Team</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <GenericRecordForm
                        type='create'
                        collection='experimentOperatorTeam'
                        additionalPayloadProps={{
                            studyId,
                        }}
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
