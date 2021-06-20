import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '../date-fns';
import Pair from '../pair';
import Split from '../split';
import SchemaForm from '../default-schema-form';

import ReservationFormContainer from './reservation-form-container';
import ExperimentFormContainer from './experiment-form-container';

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

const ConfirmModal = ({
    show,
    onHide,

    experimentData,
    studyData,
    confirmData,

    subjectData,

    onSuccessfulUpdate,
}) => {

    if (!show) {
        return null;
    }

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };


    var FormContainer = (
        confirmData.experimentRecord
        ? ExperimentFormContainer
        : ReservationFormContainer
    );

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
                    subjectData,
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

export default ConfirmModal;
