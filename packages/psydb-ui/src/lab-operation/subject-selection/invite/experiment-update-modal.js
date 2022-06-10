import React, { useState } from 'react';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Modal, Button, Alert } from '@mpieva/psydb-ui-layout';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const ExperimentUpdateModal = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData = {},

        inviteType,
        
        studyData,
        subjectId,
        subjectLabel,
        
        desiredTestInterval,
        testableIntervals,

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
            labProcedureTypeKey: inviteType,
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

        var isSubjectTestable = false;
        //console.log({ testableIntervals });
        if (testableIntervals) {
            var intersections = intervalfns.intersect(
                [{ start: start, end: end }],
                testableIntervals
            );
            //console.log({ intersections });
            isSubjectTestable = intersections.length > 0;
        }

        body = (
            <>
                { !isSubjectTestable && (
                    <Alert variant='warning'>
                        <b>Nicht in Altersfenster</b>
                    </Alert>
                )} 
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
