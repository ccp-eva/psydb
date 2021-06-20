import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import useFetch from '../use-fetch';
import useModalReducer from '../use-modal-reducer';
import LoadingIndicator from '../loading-indicator';
import StudyInhouseLocations from '../study-inhouse-locations';

import ConfirmModal from './confirm-modal';

const MoveSubjectModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }

    return (
        <MoveSubjectModal { ...ps } />
    );
}

const MoveSubjectModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    studyData,
    subjectDataByType,
    payloadData,

    onSuccessfulUpdate,
}) => {
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    var [ state, dispatch ] = useReducer(reducer, {});
    var { calendarRevision } = state;

    var confirmModal = useModalReducer({ show: false });

    if (shouldFetch && !didFetch) {
        return null;
        /*return (
            <LoadingIndicator size='lg' />
        );*/
    }

    experimentData = experimentData || fetched.data.experimentData;
    studyData = studyData || fetched.data.studyData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;
    var { subjectId, subjectType } = payloadData;

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Proband verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <ConfirmModal { ...({
                    show: confirmModal.show,
                    onHide: confirmModal.handleHide,
                    confirmData: confirmModal.data,

                    experimentData,
                    studyData,

                    subjectData: { record: subjectRecord },

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />

                <StudyInhouseLocations
                    studyId={ studyId }
                    studyRecordType={ studyRecordType }

                    //activeLocationType={ 'instituteroom' }
                    onSelectReservationSlot={ 
                        confirmModal.handleShow
                    }
                    onSelectExperimentSlot={
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

export default MoveSubjectModalWrapper;
