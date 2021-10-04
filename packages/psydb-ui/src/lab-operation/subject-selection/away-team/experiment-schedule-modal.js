import React, { useState, useEffect, useReducer } from 'react';

import { Modal } from 'react-bootstrap';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import StudyAwayTeams from '@mpieva/psydb-ui-lib/src/study-away-teams';

import ConfirmModal from './confirm-modal';

const ExperimentScheduleModal = ({
    show,
    onHide,

    studyId,
    studyType,
    modalPayloadData,

    onSuccessfulUpdate,
}) => {
    var {
        locationRecord,
        selectedSubjectRecords
    } = modalPayloadData;

    var confirmModal = useModalReducer();

    var wrappedOnSuccessfulUpdate = (...args) => {
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
        onHide();
    };

    return (
        <>
            
            <ConfirmModal { ...({
                show: confirmModal.show,
                onHide: confirmModal.handleHide,
                
                modalPayloadData: confirmModal.data,
                
                studyId,
                locationRecord,
                selectedSubjectRecords,
                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            }) } />

            <Modal
                show={show}
                onHide={ onHide }
                size='xl'
                className='team-modal'
                backdropClassName='team-modal-backdrop'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Termin eintragen</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-light'>
                    <StudyAwayTeams { ...({
                        studyId,
                        studyRecordType: studyType,
                        
                        onSelectReservationSlot: confirmModal.handleShow
                    }) } />
                </Modal.Body>
            </Modal>
        </>
    )
}


const ExperimentScheduleModalWrapper = (ps) => {
    if (!ps.modalPayloadData) {
        return null;
    }
    return (
        <ExperimentScheduleModal { ...ps } />
    );
}


export default ExperimentScheduleModalWrapper;
