import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import datefns from './date-fns';
import Pair from './pair';
import StudyTeamListItem from './experiment-operator-team-list-item';

const wrapOnChange = (onChange) => (event) => {
    var { target: { value }} = event;
    return onChange(value);
}

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
        teamId,

        onChangeEnd,
        onChangeComment,
        onChangeAutoConfirm,
        onChangeTeamId
    } = ps;


    return (
        <div>
            { subjectLabel && (
                <>
                    <Container>
                        <Pair className='mb-2' label="Proband">
                            { subjectLabel }
                        </Pair>
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
                <Pair className='mb-2' label='Datum'>
                    { datefns.format(new Date(start), 'P') }
                </Pair>

                <Pair className='mb-2'label='Beginn'>
                    { datefns.format(new Date(start), 'p') }
                </Pair>

                <EndControl { ...({
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,
                    onChangeEnd,
                })} />

                { teamRecords && (
                    <TeamControl { ...({
                        teamId,
                        teamRecords,
                        onChangeTeamId
                    })} />
                )}
            </Container>
        </div>
    );
}

const CommentControl = (ps) => {
    var { comment, onChangeComment } = ps;
    if (onChangeComment) {
        var onChange = wrapOnChange(onChangeComment);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Kommentar
                </Form.Label>
                <Col sm={8}>
                    <Form.Control
                        type="text"
                        value={ comment }
                        onChange={ onChange}
                    />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Pair className='mb-2' label="Kommentar" textWrap='span'>
                <i className='text-muted'>{ comment }</i>
            </Pair>
        )
    }
}

const AutoConfirmControl = (ps) => {
    var { autoConfirm, onChangeAutoConfirm } = ps;
    if (onChangeAutoConfirm) {
        var onChange = wrapOnChange(onChangeAutoConfirm);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Bestätigen
                </Form.Label>
                <Col sm={8}>
                    <BoolControl
                        value={ autoConfirm }
                        onChange={ onChange }
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
        var onChange = wrapOnChange(onChangeEnd);
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Ende
                </Form.Label>
                <Col sm={8}>
                    <SlotControl
                        value={ end  }
                        onChange={ onChange }
                        min={ minEnd }
                        max={ maxEnd }
                        step={ slotDuration }
                    />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Pair className='mb-2' label='Ende'>
                { datefns.format(new Date(end), 'p') }
            </Pair>
        )
    }

}

const TeamControl = (ps) => {
    var {
        teamId,
        teamRecords,
        onChangeTeamId
    } = ps;

    if (onChangeTeamId) {
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Team
                </Form.Label>
                <Col sm={8}>
                    {
                        teamRecords
                            .filter(it => it.state.hidden !== true)
                            .map(it => (
                                <StudyTeamListItem { ...({
                                    key: it._id,
                                    record: it,
                                    active: it._id === teamId,
                                    onClick: onChangeTeamId
                                   // studyId,
                                   // record,
                                   // relatedRecordLabels,
                                   // onClick: onSelectTeam,
                                }) } />
                            ))
                    }
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row className='mb-2'>
                <Form.Label className='col-sm-4 col-form-label'>
                    Team
                </Form.Label>
                <Col sm={8}>
                    <StudyTeamListItem record={ teamRecords[0] } />
                </Col>
            </Row>
        );
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
        var realValue = options[value].value;
        return onChange({ target: { value: realValue }});
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

    var [ internalValue, setInternalValue ] = useState(0);
    var wrappedOnChange = (event) => {
        var { target: { value }} = event;
        setInternalValue(value);
        var realValue = slots[value];
        return onChange({ target: { value: realValue }});
    };


    return (
        <Form.Control { ...({
            as: 'select',
            onChange: wrappedOnChange,
            value: internalValue,
        }) } >
            { slots.map((it, index) => (
                <option
                    key={ it }
                    value={ index }
                >
                    { datefns.format(it, 'p') }
                </option>
            ))}
        </Form.Control>
    )
}

export default ExperimentShortControls;
