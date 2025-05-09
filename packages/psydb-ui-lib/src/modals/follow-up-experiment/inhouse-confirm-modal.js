import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
// FIXME: invite-confirm-modal as its also video-calls now
//
import {
    Modal,
    Button,
    Container,
    Row,
    Col,
    Pair,
    Split,
    Form,
} from '@mpieva/psydb-ui-layout';

import { useRequestAgent } from '@mpieva/psydb-ui-contexts';
import datefns from '../../date-fns';

import {
    Duration,
    FormattedDuration,
    HOUR,
    MINUTE
} from '@mpieva/psydb-common-lib/src/durations';

const extractTime = (dateIsoString) => (
    NaN !== (new Date(dateIsoString)).getTime()
    ? Duration(datefns.format(new Date(dateIsoString), 'HH:mm:ss.SSS') + 'Z')
    : dateIsoString
);

const FormContainer = (ps) => {
    var {
        onHide,
        experimentData,
        studyData,
        confirmData,

        onSuccessfulUpdate,
    } = ps;
    
    var agent = useRequestAgent();

    var {
        _id: studyId,
        type: studyRecordType,
    } = studyData.record;

    var {
        type: experimentType,
        state: experimentState
    } = experimentData.record;

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
            type: `experiment/move-${experimentType}`,
            payload: {
                experimentId: experimentData.record._id,
                locationId: confirmData.locationRecord._id,
                experimentOperatorTeamId: (
                    confirmData.reservationRecord.state.experimentOperatorTeamId
                ),
                interval: {
                    start: confirmData.start.toISOString(),
                    end: new Date(selectedEnd).toISOString(),
                }
            }
        };

        return agent.send({ message }).then(response => {
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }

    return (
        <div>
            <header className='pb-1'><b>Aktuell</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(experimentState.interval.start),
                            'P'
                        ) }
                    </Pair>

                    <Pair label='Beginn'>
                        { datefns.format(
                            new Date(experimentState.interval.start),
                            'p'
                        ) }
                    </Pair>
                    <Pair label='Ende'>
                        { datefns.format(
                            new Date(experimentState.interval.end).getTime() + 1,
                            'p'
                        ) }
                    </Pair>

                </Container>
            </div>

            <header className='pb-1 mt-3'><b>nach Verschiebung</b></header>
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
                            Ende
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

const InhouseConfirmModal = ({
    show,
    onHide,

    experimentData,
    studyData,
    modalPayloadData: confirmData,

    onSuccessfulUpdate,
}) => {

    if (!show) {
        return null;
    }

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };
    //console.log(confirmData);

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Experiment verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <FormContainer { ...({
                    experimentData,
                    studyData,
                    confirmData,

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />
            </Modal.Body>
        </Modal>
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

export default InhouseConfirmModal;
