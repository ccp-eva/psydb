import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import { useSend } from '@mpieva/psydb-ui-hooks';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '../date-fns';
import Pair from '../pair';
import Split from '../split';
import SchemaForm from '../default-schema-form';
import ExperimentIntervalSummary from '../experiment-interval-summary';
import {
    SubjectControls,
    ScheduleItemControls
} from '../experiment-short-controls';

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

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(minEnd);

    var handleSubmit = useSend(() => ({
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
    }), {
        onSuccessfulUpdate,
        dependencies: [
            experimentData, subjectData. confirmData,
            end, comment, autoConfirm
        ]
    });

    return (
        <div>
            <Container>
                <SubjectControls { ...({
                    subjectLabel: subjectData.record._recordLabel,
                    comment,
                    autoConfirm,

                    onChangeComment: setComment,
                    onChangeAutoConfirm: setAutoConfirm
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
            <hr />

            {/*<ExperimentShortControls {...({
                subjectLabel: subjectData.record._recordLabel,
                start: confirmData.start,
                end: selectedEnd,
                minEnd,
                maxEnd: confirmData.maxEnd,
                slotDuration: confirmData.slotDuration,
                comment: 'foofofof',
                onChangeEnd: handleSelectEnd,
                onChangeAutoConfirm: () => {}
            })} />*/}
        </div>
    )

}

const SlotControl = ({
    value,
    onChange,
    min,
    max,
    step,
}) => {
    var slots = [];
    for (var t = min.getTime(); t < max.getTime(); t += step) {
        slots.push(new Date(t));
    }

    return (
        <Form.Control { ...({
            as: 'select',
            onChange,
            value
        }) } >
            { slots.map(it => (
                <option
                    key={ it }
                    value={ it }
                >
                    { datefns.format(it, 'p') }
                </option>
            ))}
        </Form.Control>
    )
}

export default ReservationFormContainer;
