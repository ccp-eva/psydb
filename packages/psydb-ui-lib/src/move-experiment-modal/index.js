import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import useFetch from '../use-fetch';
import useModalReducer from '../use-modal-reducer';
import LoadingIndicator from '../loading-indicator';
import StudyInhouseLocations from '../study-inhouse-locations';

import ConfirmModal from './confirm-modal';

const MoveExperimentModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    studyData,

    onSuccessfulUpdate,
}) => {
    var confirmModal = useModalReducer({ show: false });

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        calendarRevision,
    } = state;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    studyData = studyData || fetched.data.studyData;

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;

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
                    show: confirmModal.show,
                    onHide: confirmModal.handleHide,

                    experimentData,
                    studyData,
                    confirmData: confirmModal.data,

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />

                <StudyInhouseLocations
                    studyId={ studyId }
                    studyRecordType={ studyRecordType }

                    //activeLocationType={ 'instituteroom' }
                    onSelectReservationSlot={ 
                        confirmModal.handleShow
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
        case 'increase-calendar-revision':
            return {
                ...state,
                calendarRevision: (state.calendarRevision || 0) + 1
            }
    }
}

const MoveExperimentModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <MoveExperimentModal { ...ps } />
    );
}


export default MoveExperimentModalWrapper;
