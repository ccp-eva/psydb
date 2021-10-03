import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';

import { createSend } from '@mpieva/psydb-ui-hooks';

import ExperimentIntervalSummary from '../../experiment-interval-summary';
import {
    SubjectControls,
    ScheduleItemControls,
    useControlStates
} from '../../experiment-short-controls';

const ReservationFormContainer = ({
    onHide,
    experimentData,
    studyData,
    confirmData,
    subjectData,

    onSuccessfulUpdate,
}) => {

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;
    var experimentState = experimentData.record.state;

    var {
        reservationRecord,
        locationRecord,
        start,
        maxEnd,
        slotDuration
    } = confirmData;

    var {
        comment,
        autoConfirm,

        onChangeComment,
        onChangeAutoConfirm,
    } = useControlStates();

    /*var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration - 1);
    var [ end, setEnd ] = useState(minEnd);*/

    var handleSubmit = createSend(() => ({
        type: 'experiment/move-subject-inhouse',
        payload: {
            experimentId: experimentData.record._id,
            subjectId: subjectData.record._id,
            target: {
                locationId: locationRecord._id,
                experimentOperatorTeamId: (
                    reservationRecord.state.experimentOperatorTeamId
                ),
                interval: {
                    start: start.toISOString(),
                    end: new Date(end).toISOString(),
                },
            },
            comment,
            autoConfirm,
        }
    }), { onSuccessfulUpdate });

    return (
        <div>
            <Container>
                <SubjectControls { ...({
                    subjectLabel: subjectData.record._recordLabel,
                    comment,
                    autoConfirm,

                    onChangeComment,
                    onChangeAutoConfirm,
                })} />
            </Container>

            <hr />

            <header className='pb-1'><b>Aktuell</b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentData.record }
                />
            </div>

            <header className='pb-1 mt-3'><b>Verschieben Nach</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <ScheduleItemControls { ...({
                        start,
                        end,
                        minEnd,
                        maxEnd,
                        slotDuration,

                        onChangeEnd: setEnd,
                    })} />
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button size='sm' onClick={ handleSubmit }>
                    Verschieben
                </Button>
            </div>
        </div>
    )

}

export default ReservationFormContainer;
