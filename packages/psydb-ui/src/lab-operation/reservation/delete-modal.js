import React, { useState, useEffect } from 'react';

import {
    Button,
    Modal
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import {
    Duration,
    FormattedDuration
} from '@mpieva/psydb-common-lib/src/durations';

import {
    ConstWidget,
    TimeSlotWidget,
    ExperimentOperatorTeamIdWidget,
} from '@mpieva/psydb-ui-lib/src/rjsf-components';

const extractTime = (dateIsoString) => (
    NaN !== (new Date(dateIsoString)).getTime()
    ? datefns.format(new Date(dateIsoString), 'HH:mm:ss.SSS') + 'Z'
    : dateIsoString
);

const DeleteModal = ({
    show,
    onHide,
    studyId,
    locationId,
    date,
    reservationRecords,
    teamRecords,
    onSuccessfulDelete,
}) => {
    if (!show) {
        return null;
    }
    //var fallbackDate = new Date(0);
    
    /*start = start || fallbackDate;
    maxEnd = maxEnd || fallbackDate;
    console.log(slotDuration);
    slotDuration = slotDuration || Duration('0:30')*/

    var startOfDay = datefns.startOfDay(date).getTime();

    var handleSubmit = ({ formData }) => {
        var { end, experimentOperatorTeamId } = formData;
        var message = {
            type: 'reservation/reserve-inhouse-slot',
            payload: {
                props: {
                    studyId,
                    experimentOperatorTeamId,
                    locationId,
                    interval: {
                        start: start.toISOString(),
                        end: (
                            new Date(startOfDay + Duration(end) - 1)
                            .toISOString()
                        ),
                    }
                }
            }
        }
        agent.send({ message }).then((response) => {
            onSuccessfulCreate && onSuccessfulCreate(response);
            onHide();
        });
    }

    return (
        <Modal show={show} onHide={ onHide } size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Löschen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    reservieringsdetails ...
                </div>
                <Button>Löschen</Button>
            </Modal.Body>
        </Modal>
    );
}

export default DeleteModal;
