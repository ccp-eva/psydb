import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createSend } from '@mpieva/psydb-ui-utils';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const ExperimentUpdateModal = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData = {},

        subjectId,
        subjectLabel,
        
        onSuccessfulUpdate,
    } = ps;
 
    var {
        experimentRecord,
        locationRecord,
        slotDuration,
        start,
        studyId
    } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    var handleSubmit = createSend(() => ({
        type: 'experiment/add-subject',
        payload: {
            labProcedureTypeKey: 'online-video-call',
            experimentId: experimentRecord._id,
            subjectId,
            comment,
            autoConfirm,
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ experimentRecord, subjectId ]
    });

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var body = null;
    if (show) {
        var { start, end } = experimentRecord.state.interval;
        end = new Date(end.getTime() + 1);

        body = (
            <>
                <ExperimentShortControls {...({
                    start,
                    end,
                    subjectLabel,
                    onChangeComment: setComment,
                    onChangeAutoConfirm: setAutoConfirm,
                })} />
                <hr />
                <div className='d-flex justify-content-end'>
                    <Button size="sm" onClick={ handleSubmit }>
                        Hinzufügen
                    </Button>
                </div>
            </>
        );
    }

    return (
        <Modal show={ show } onHide={ onHide } size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { body }
            </Modal.Body>
        </Modal>
    );
}

export default ExperimentUpdateModal;
