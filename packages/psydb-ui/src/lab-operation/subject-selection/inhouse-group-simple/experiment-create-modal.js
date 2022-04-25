import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useSend } from '@mpieva/psydb-ui-hooks';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const CreateModal = (ps) => {
    var {
        show,
        onHide,
        //studyId,
        subjectGroupId,
        teamRecords,
        modalPayloadData,

        onSuccessfulCreate,
    } = ps;

    console.log(modalPayloadData);

    if (!show) {
        return null;
    }

    var {
        studyId,
        locationRecord,
        teamRecords,
        start,
        slotDuration,
        maxEnd,
    } = modalPayloadData;

    var locationId = locationRecord._id;
    var [ comment, setComment ] = useState('');

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulCreate && onSuccessfulCreate(...args);
    };

    var send = useSend(() => ({
        type: 'experiment/create-inhouse-group-simple',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId,
                locationId,
                subjectGroupId,
                comment,

                interval: {
                    start: start.toISOString(),
                    end: end.toISOString()
                }
            }
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ subjectGroupId, comment ]
    });

    return (
        <Modal show={show} onHide={ onHide } size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExperimentShortControls { ...({
                    start,
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,

                    comment,
                    teamRecords,

                    onChangeTeam: () => {},
                    onChangeComment: setComment,
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
