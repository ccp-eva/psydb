import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import ConfirmModal from './confirm-modal';

const MoveExperimentModal = ({
    show,
    onHide,

    experimentData,
    studyData,

    onSuccessfulUpdate,
}) => {
    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        showConfirm,
        confirmData,
        calendarRevision,
    } = state;

    var handleShowConfirm = useCallback((payload) => (
        dispatch({ type: 'show-confirm', payload })
    ), []);
    var handleHideConfirm = useCallback(() => (
        dispatch({ type: 'hide-confirm' })
    ), []);

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

                <ConfirmModal { ...({
                    show: showConfirm,
                    onHide: handleHideConfirm,

                    experimentData,
                    studyData,
                    confirmData,

                    onSuccessfulUpdate,
                }) } />

                <StudyInhouseLocations
                    studyId={ studyId }
                    studyRecordType={ studyRecordType }

                    //activeLocationType={ 'instituteroom' }
                    onSelectReservationSlot={ 
                        handleShowConfirm
                    }
                    calendarRevision={ calendarRevision }
                    
                    locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
                />

            </Modal.Body>
        </Modal>
    )
}


var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'show-confirm':
            return {
                ...state,
                showConfirm: true,
                confirmData: {
                    ...payload
                }
            }
        case 'hide-confirm':
            return {
                ...state,
                showConfirm: false,
            }
        case 'increase-calendar-revision':
            return {
                ...state,
                calendarRevision: (state.calendarRevision || 0) + 1
            }
    }
}

export default MoveExperimentModal;
