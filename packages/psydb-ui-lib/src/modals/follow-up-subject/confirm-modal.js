import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import {
    Modal,
    Button,
    Pair,
    Split
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

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Termin verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
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
