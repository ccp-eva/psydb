import React, { useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import GenericRecordForm from '@mpieva/psydb-ui-lib/src/generic-record-form';

export const EditModal = ({
    show,
    onHide,
    onSuccessfulUpdate,
    editModalData,
}) => {
    if (!editModalData) {
        return null;
    }

    var { teamId } = editModalData;
    
    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Team bearbeiten</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <GenericRecordForm
                        type='edit'
                        collection='experimentOperatorTeam'
                        id={ teamId }
                        onSuccessfulUpdate={ () => {
                            onHide();
                            onSuccessfulUpdate && onSuccessfulUpdate();
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}
