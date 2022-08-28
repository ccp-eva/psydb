import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import {
    Modal,
    Button,
    Pair,
    Split,
    Alert,
} from '@mpieva/psydb-ui-layout';

import ReservationFormContainer from './reservation-form-container';
import ExperimentFormContainer from './experiment-form-container';

const ConfirmModal = ({
    show,
    onHide,
    modalPayloadData,

    experimentData,
    studyData,
    subjectData,
    testableIntervals,

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
        modalPayloadData.experimentRecord
        ? ExperimentFormContainer
        : ReservationFormContainer
    );

    var { start, maxEnd } = modalPayloadData;
    var isSubjectTestable = false;
    //console.log({ testableIntervals });
    if (testableIntervals) {
        var intersections = intervalfns.intersect(
            [{ start: start, end: maxEnd }],
            testableIntervals
        );
        //console.log({ intersections });
        isSubjectTestable = intersections.length > 0;
    }

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Folgetermin</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                { !isSubjectTestable && (
                    <Alert variant='danger'>
                        <b>Nicht in Altersfenster</b>
                    </Alert>
                )} 
                <FormContainer { ...({
                    confirmData: modalPayloadData,
                    experimentData,
                    studyData,
                    subjectData,

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmModal;
