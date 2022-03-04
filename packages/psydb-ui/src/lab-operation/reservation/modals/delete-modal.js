import React, { useState, useEffect } from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const DeleteModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        onSuccessfulUpdate
    } = ps;

    var {
        studyId,
        locationRecord,
        reservationRecord,
        start,
        slotDuration,
        maxEnd,
    } = modalPayloadData;

    var locationId = locationRecord._id;
    var { experimentOperatorTeamId } = reservationRecord.state;

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));

    var send = useSend(() => ({
        type: 'reservation/remove-inhouse-slot',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId,
                locationId,
                interval: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            }
        }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ],
    })

    return (
        <>
            <ExperimentShortControls { ...({
                start,
                end,
                minEnd,
                maxEnd,
                slotDuration,

                onChangeEnd: setEnd,
            })} />

            <hr />
            <div className='d-flex justify-content-end'>
                <Button size='sm' variant='danger' onClick={ send.exec }>
                    Speichern
                </Button>
            </div>
        </>
    );
}

export const DeleteModal = WithDefaultModal({
    Body: DeleteModalBody,

    size: 'md',
    title: 'Löschen',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-white'
});
