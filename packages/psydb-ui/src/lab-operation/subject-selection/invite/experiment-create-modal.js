import React, { useState } from 'react';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Modal, Button, Alert } from '@mpieva/psydb-ui-layout';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const CreateModal = (ps) => {
    var {
        show,
        onHide,

        inviteType,

        studyData,
        subjectId,
        subjectLabel,

        desiredTestInterval,
        testableIntervals,

        studyId,
        locationRecord,
        reservationRecord,
        teamRecords,
        start,
        slotDuration,
        maxEnd,

        onSuccessfulCreate,
    } = ps;

    if (!show) {
        return null;
    }

    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;

    var locationId = locationRecord._id;
    var experimentOperatorTeamId = (
        reservationRecord.state.experimentOperatorTeamId
    );

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));

    var wrappedOnSuccessfulUpdate = (...args) => {
        var shouldHide = !enableFollowUpExperiments;
        onHide();
        onSuccessfulCreate && onSuccessfulCreate(shouldHide, ...args);
    };

    var isSubjectTestable = false;
    //console.log({ testableIntervals });
    if (testableIntervals) {
        var intersections = intervalfns.intersect(
            [{ start: start, end: maxEnd }],
            testableIntervals
        );
        //console.log({ intersections });
        isSubjectTestable = intersections.length > 0;
    }

    var messageType = undefined;
    if (inviteType === 'inhouse') {
        messageType = 'experiment/create-from-inhouse-reservation';
    }
    else if (inviteType === 'online-video-call') {
        messageType = 'experiment/create-from-online-video-call-reservation';
    }

    var send = useSend(() => ({
        type: messageType,
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId,
                locationId,
                //subjectIds: [ subjectId ],
                subjectData: [{ subjectId, comment, autoConfirm }],

                interval: {
                    start: start.toISOString(),
                    end: end.toISOString()
                }
            }
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ subjectId, comment, autoConfirm ]
    });

    return (
        <Modal show={show} onHide={ onHide } size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { !isSubjectTestable && (
                    <Alert variant='danger'>
                        <b>Nicht in Altersfenster</b>
                    </Alert>
                )} 
                <ExperimentShortControls { ...({
                    subjectLabel,

                    start,
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,

                    comment,
                    autoConfirm,

                    onChangeComment: setComment,
                    onChangeAutoConfirm: setAutoConfirm,
                    onChangeEnd: setEnd,
                })} />

                <hr />
                <div className='d-flex justify-content-end'>
                    <Button size='sm' onClick={ send.exec }>
                        Speichern
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default CreateModal;
