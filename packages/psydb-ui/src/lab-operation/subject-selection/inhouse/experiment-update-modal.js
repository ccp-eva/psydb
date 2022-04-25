import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSend } from '@mpieva/psydb-ui-hooks';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const ExperimentUpdateModal = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData = {},

        studyData,
        subjectId,
        subjectLabel,
        
        onSuccessfulUpdate,
    } = ps;

    if (!show) {
        return null;
    }
 
    var {
        experimentRecord,
        locationRecord,
        slotDuration,
        start,
        studyId
    } = modalPayloadData;

    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;

    var wrappedOnSuccessfulUpdate = (...args) => {
        var shouldHide = !enableFollowUpExperiments;
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(shouldHide, ...args);
    };

    var send = useSend(() => ({
        type: 'experiment/add-subject',
        payload: {
            labProcedureTypeKey: 'inhouse',
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
                    <Button size="sm" onClick={ send.exec }>
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
