import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import Pair from '@mpieva/psydb-ui-lib/src/pair';
import Split from '@mpieva/psydb-ui-lib/src/split';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';
import ExperimentIntervalSummary from '@mpieva/psydb-ui-lib/src/experiment-interval-summary';

const CreateByReservationFormContainer = ({
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

    var minEnd = new Date(
        confirmData.start.getTime() + confirmData.slotDuration
    );
    var [ selectedEnd, setSelectedEnd ] = useState(minEnd.toISOString());
    var handleSelectEnd = useCallback((event) => {
        var { target: { value }} = event;
        setSelectedEnd(value);
    }, [])

    var handleSubmit = () => {
        var message = {
            type: 'experiment/move-subject-inhouse',
            payload: {
                experimentId: experimentData.record._id,
                subjectId: subjectData.record._id,
                target: {
                    locationId: confirmData.locationRecord._id,
                    experimentOperatorTeamId: (
                        confirmData.reservationRecord.state.experimentOperatorTeamId
                    ),
                    interval: {
                        start: confirmData.start.toISOString(),
                        end: new Date(selectedEnd).toISOString(),
                    }
                }
            }
        };

        return agent.send({ message }).then(response => {
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }

    return (
        <div>
            <header><b>Proband</b></header>
            <div className='pt-2 pb-2 pl-4 mb-1'>{
                subjectData.record._recordLabel
            }</div>

            <header className='pb-1'><b>Aktuell</b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentData.record }
                />
            </div>

            <header className='pb-1 mt-3'><b>Verschieben Nach</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(confirmData.start),
                            'P'
                        ) }
                    </Pair>
                    <Pair label='Beginn'>
                        { datefns.format(
                            new Date(confirmData.start),
                            'p'
                        ) }
                    </Pair>
                    <Row>
                        <Form.Label className='col-sm-4 col-form-label'>
                            Bis
                        </Form.Label>
                        <Col sm={8}>
                            <SlotControl
                                value={ selectedEnd  }
                                onChange={ handleSelectEnd }
                                min={ minEnd }
                                max={ confirmData.maxEnd }
                                step={ confirmData.slotDuration }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ handleSubmit }>Verschieben</Button>
            </div>
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

export default CreateByReservationFormContainer;
