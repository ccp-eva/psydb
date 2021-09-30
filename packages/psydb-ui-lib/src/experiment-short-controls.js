import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import datefns from './date-fns';
import Pair from './pair';

//FIXME: not sure about this name
const ExperimentShortControls = (ps) => {
    var {
        start,
        end,
        minEnd,
        maxEnd,
        slotDuration,

        subjectLabel,
        comment,
        autoConfirm,

        teamRecords,
        selectedTeamId,

        onChangeEnd,
        onChangeComment,
        onChangeAutoConfirm,
        onChangeTeam
    } = ps;

    return (
        <div>
            { subjectLabel && (
                <>
                    <Container>
                        <Pair label="Proband">{ subjectLabel }</Pair>
                        <CommentControl { ...({
                            comment,
                            onChangeComment
                        })} />
                        <AutoConfirmControl { ...({
                            autoConfirm,
                            onChangeAutoConfirm
                        })} />
                    </Container>
                    <hr />
                </>
            )}
            <Container>
                <Pair label='Datum'>
                    { datefns.format(new Date(start), 'P') }
                </Pair>

                <Pair label='Beginn'>
                    { datefns.format(new Date(start), 'p') }
                </Pair>

                <EndControl { ...({
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,
                    onChangeEnd,
                })} />

                <TeamControl { ...({
                    teamRecords,
                    onChangeTeam
                })} />

            </Container>
        </div>
    );
}

const CommentControl = (ps) => {
    var { comment, onChangeComment } = ps;
    if (onChangeComment) {
        return (
            <Row>
                <Form.Label className='col-sm-4 col-form-label'>
                    Kommentar
                </Form.Label>
                <Col sm={8}>
                    FORMCONTROL
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Pair label="Kommentar" textWrap='span'>
                <i className='text-muted'>{ comment }</i>
            </Pair>
        )
    }
}

const AutoConfirmControl = (ps) => {
    var { autoConfirm, onChangeAutoConfirm } = ps;
    if (onChangeAutoConfirm) {
         return (
            <Row>
                <Form.Label className='col-sm-4 col-form-label'>
                    Bestätigen
                </Form.Label>
                <Col sm={8}>
                    <BoolControl
                        value={ autoConfirm }
                        onChange={ onChangeAutoConfirm }
                    />
                </Col>
            </Row>
        )
    }
    else {
        return null
    }
}

const EndControl = (ps) => {
    var {
        end,
        minEnd,
        maxEnd,
        slotDuration,

        onChangeEnd,
    } = ps;

    if (onChangeEnd) {
        return (
            <Row>
                <Form.Label className='col-sm-4 col-form-label'>
                    Ende
                </Form.Label>
                <Col sm={8}>
                    <SlotControl
                        value={ end  }
                        onChange={ onChangeEnd }
                        min={ minEnd }
                        max={ maxEnd }
                        step={ slotDuration }
                    />
                </Col>
            </Row>
        )
    }
    else {
        <Pair label='Ende'>
            { datefns.format(new Date(end), 'p') }
        </Pair>
    }

}

const BoolControl = ({
    value,
    onChange
}) => {
    var [ internalValue, setInternalValue ] = useState(0);
    var options = [
        { label: 'Nein', value: false },
        { label: 'Ja' , value: true }
    ];

    var wrappedOnChange = (event) => {
        var { target: { value }} = event;
        setInternalValue(value);
        var realValue = options[value];
        return { target: { value: realValue }};
    };

    return (
        <Form.Control { ...({
            as: 'select',
            onChange: wrappedOnChange,
            value: internalValue
        }) } >
            { options.map(({ label, value }, index) => (
                <option
                    key={ index }
                    value={ index }
                >
                    { label }
                </option>
            ))}
        </Form.Control>
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

const TeamControl = (ps) => {
    return null;
}

export default ExperimentShortControls;
