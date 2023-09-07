import React from 'react';

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

    var experimentSubjectData = experimentState.subjectData.find(it => (
        it.subjectId === subjectData.record._id
    ));

    var translate = useUITranslation();

    var {
        end,
        comment,
        autoConfirm,

        onChangeEnd,
        onChangeComment,
        onChangeAutoConfirm,
    } = useControlStates({ start, slotDuration, defaults: {
        comment: experimentSubjectData.comment
    }});

    var send = useSend(() => ({
        type: `experiment/move-subject-${experimentType}`,
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
                    // FIXME: maxEnd and therefor end is already
                    // reduced by 1 millisecond here
                    end: new Date(end.getTime() + 1).toISOString(),
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
                { translate('Reschedule To') }
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
                <Button size='sm' onClick={ send.exec }>
                    { translate('Reschedule') }
                </Button>
            </div>
        </div>
    )

}

export default ReservationFormContainer;
