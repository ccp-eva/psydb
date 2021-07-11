import React, { useState, useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

const ExperimentScheduleModal = ({
    show,
    onHide,

    modalPayload,

    onSuccessfulUpdate,
}) => {
    console.log(modalPayload);
    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Experiment verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                FOOO
            </Modal.Body>
        </Modal>
    )
}


var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'increase-calendar-revision':
            return {
                ...state,
                calendarRevision: (state.calendarRevision || 0) + 1
            }
    }
}

const ExperimentScheduleModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <ExperimentScheduleModal { ...ps } />
    );
}


export default ExperimentScheduleModalWrapper;
