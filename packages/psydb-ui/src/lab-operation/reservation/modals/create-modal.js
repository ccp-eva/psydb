import React, { useState } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const CreateModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        onSuccessfulUpdate
    } = ps;

    var {
        studyId,
        locationRecord,
        teamRecords,
        start,
        slotDuration,
        maxEnd,
    } = modalPayloadData;

    var translate = useUITranslation();
    var locationId = locationRecord._id;

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));
    var [ teamId, setTeamId ] = useState(
        teamRecords.find(it => !it.state.hidden)?._id
    );

    var send = useSend(() => ({
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

                teamRecords,
                teamId,

                onChangeEnd: setEnd,
                onChangeTeamId: setTeamId
            })} />

            <hr />
            <div className='d-flex justify-content-end'>
                <Button
                    disabled={ !teamId }
                    onClick={ send.exec }
                >
                    { translate('Reserve') }
                </Button>
            </div>
        </>
    );
}

export const CreateModal = WithDefaultModal({
    Body: CreateModalBody,

    size: 'md',
    title: 'Reservation',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-white'
});
