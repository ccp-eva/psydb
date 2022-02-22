import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useSend } from '@mpieva/psydb-ui-hooks';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const CreateModal = ({
    show,
    onHide,
    subjectId,
    subjectLabel,

    studyId,
    locationRecord,
    reservationRecord,
    teamRecords,
    start,
    slotDuration,
    maxEnd,

    onSuccessfulCreate,
}) => {
    if (!show) {
        return null;
    }

    var locationId = locationRecord._id;
    var experimentOperatorTeamId = (
        reservationRecord.state.experimentOperatorTeamId
    );

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulCreate && onSuccessfulCreate(...args);
    };

    var send = useSend(() => ({
        type: 'experiment/create-from-inhouse-reservation',
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
