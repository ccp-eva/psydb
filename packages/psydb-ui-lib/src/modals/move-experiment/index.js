import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import useFetch from '../use-fetch';
import useModalReducer from '../use-modal-reducer';
import LoadingIndicator from '../loading-indicator';

import StudyInhouseLocations from '../study-inhouse-locations';
import StudyAwayTeams from '../study-away-teams';

import InhouseConfirmModal from './inhouse-confirm-modal';
import AwayTeamConfirmModal from './away-team-confirm-modal';

const MoveExperimentModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    teamData,
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
    teamData = teamData || fetched.data.experimentOperatorTeamData;
    studyData = studyData || fetched.data.studyData;

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;

    var prerenderedCalendar = null;
    var prerenderedConfirmModal = null;
    if (experimentType === 'away-team') {
        prerenderedCalendar = (
            <StudyAwayTeams { ...({
                studyId,
                studyRecordType,
                onSelectReservationSlot: confirmModal.handleShow,
                calendarRevision,
            }) } />
        );
        prerenderedConfirmModal = (
            <AwayTeamConfirmModal { ...({
                show: confirmModal.show,
                onHide: confirmModal.handleHide,

                experimentData,
                teamData,
                studyData,
                modalPayloadData: confirmModal.data,

                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            })} />
        )
    }
    else if (experimentType === 'inhouse') {
         prerenderedCalendar = (
            <StudyInhouseLocations { ...({
                studyId,
                studyRecordType,

                //activeLocationType={ 'instituteroom' }
                onSelectReservationSlot: confirmModal.handleShow,

                calendarRevision,
                locationCalendarListClassName: (
                    'bg-white p-2 border-left border-bottom border-right'
                )
             }) } />
        );
        prerenderedConfirmModal = (
            <InhouseConfirmModal { ...({
                show: confirmModal.show,
                onHide: confirmModal.handleHide,

                experimentData,
                studyData,
                confirmData: confirmModal.data,

                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            }) } />
        );
    }

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Termin verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                { prerenderedConfirmModal }
                { prerenderedCalendar }
       
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
