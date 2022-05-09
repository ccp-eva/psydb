import React, { useMemo, useEffect, useReducer, useCallback } from 'react';

import {
    inviteExperimentTypes
} from '@mpieva/psydb-schema-enums';

import { demuxed } from '@mpieva/psydb-ui-utils';
import {
    useFetch,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import {
    Modal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import StudyInhouseLocations from '../../study-inhouse-locations';
import StudyAwayTeams from '../../study-away-teams';

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
    var { value: revision, up: increaseRevision } = useRevision();

    var wrappedOnSuccessfulUpdate = demuxed([
        onHide, onSuccessfulUpdate
    ]);

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
    teamData = teamData || fetched.data.opsTeamData;
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
                calendarRevision: revision,
                withURLSearchParams: false,
            }) } />
        );
        prerenderedConfirmModal = (
            <AwayTeamConfirmModal { ...({
                ...confirmModal.passthrough,

                studyId,
                experimentData,
                teamData,

                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            })} />
        )
    }
    else if (inviteExperimentTypes.keys.includes(experimentType)) {
         prerenderedCalendar = (
            <StudyInhouseLocations { ...({
                studyId,
                studyRecordType,

                __useNewCanSelect: true,
                //activeLocationType={ 'instituteroom' }
                checkExperimentSlotSelectable: (bag) => {
                    var isSameExperiment = (
                        bag.experimentRecord._id === experimentData.record._id
                    );
                    return isSameExperiment;
                },
                onSelectExperimentSlot: confirmModal.handleShow,
                onSelectReservationSlot: confirmModal.handleShow,

                calendarRevision: revision,
                locationCalendarListClassName: (
                    'bg-white p-2 border-left border-bottom border-right'
                )
             }) } />
        );
        prerenderedConfirmModal = (
            <InhouseConfirmModal { ...({
                ...confirmModal.passthrough,

                experimentData,
                studyData,

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


const MoveExperimentModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <MoveExperimentModal { ...ps } />
    );
}


export default MoveExperimentModalWrapper;
