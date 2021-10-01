import React, { useState, useEffect } from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    Modal
} from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const CreateModal = ({
    show,
    onHide,
    studyId,
    locationRecord,
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
    var startOfDay = datefns.startOfDay(start).getTime();

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(minEnd);
    var [ teamId, setTeamId ] = useState(teamRecords[0]._id);

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulCreate && onSuccessfulCreate(...args);
    };

    var handleSubmit = useSend(() => ({
        type: 'reservation/reserve-inhouse-slot',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId: teamId,
                locationId,
                interval: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            }
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ start, end, teamId ]
    })

    return (
        <Modal show={show} onHide={ onHide } size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Reservierung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExperimentShortControls { ...({
                    start,
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,

                    teamRecords,
                    teamId,

                    onChangeEnd: setEnd,
                    onChangeTeamId: setTeamId
                })} />

                <hr />
                <div className='d-flex justify-content-end'>
                    <Button size='sm' onClick={ handleSubmit }>
                        Speichern
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
}

export default CreateModal;
