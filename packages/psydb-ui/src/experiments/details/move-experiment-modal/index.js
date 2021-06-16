import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

const MoveExperimentModal = ({
    show,
    onHide,

    experimentData,
    studyData,

    onSuccessfulUpdate,
}) => {
    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Experiment verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                foo 
            </Modal.Body>
        </Modal>
    )
}

export default MoveExperimentModal;
