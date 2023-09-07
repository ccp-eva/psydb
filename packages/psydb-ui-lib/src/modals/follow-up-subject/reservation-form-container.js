import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, Container } from '@mpieva/psydb-ui-layout';

import ExperimentIntervalSummary from '../../experiment-interval-summary';
import {
    SubjectControls,
    ScheduleItemControls,
    useControlStates
} from '../../experiment-short-controls';

const ReservationFormContainer = (ps) => {
    var {
        confirmData,
        experimentData,
        studyData,
        subjectData,

        onSuccessfulUpdate,
    } = ps;

    var {
        _id: studyId,
        type: studyRecordType,
    } = studyData.record;

    var {
        type: experimentType,
        state: experimentState
    } = experimentData.record;

    var {
        reservationRecord,
        locationRecord,
        start,
        maxEnd,
        slotDuration
    } = confirmData;

    var {
        end,
        comment,
        autoConfirm,

        onChangeEnd,
        onChangeComment,
        onChangeAutoConfirm,
    } = useControlStates({ start, slotDuration });

    var translate = useUITranslation();

    var send = useSend(() => ({
        type: `experiment/followup-subject-${experimentType}`,
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

            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentData.record }
                />
            </div>

            <header className='pb-1 mt-3'><b>
                { translate('Follow-Up Appointment') }
            </b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <ScheduleItemControls { ...({
                        start,
                        end,
                        maxEnd,
                        slotDuration,

                        onChangeEnd,
                    })} />
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ send.exec }>
                    { translate('Save') }
                </Button>
            </div>
        </div>
    )

}

export default ReservationFormContainer;
