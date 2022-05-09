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
                calculateNewExperimentMaxEnd: (
                    createCalculateNewExperimentMaxEnd(experimentData.record._id)
                ),

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


const createCalculateNewExperimentMaxEnd = (currentExperimentId) => ({
    start,
    selectedReservationRecord,
    selectedExperimentRecord,
    reservationRecords,
    experimentRecords,
    upperBoundary,
    slotDuration,
}) => {
   
    // FIXME
    if (selectedExperimentRecord) {
        selectedReservationRecord = selectedExperimentRecord;
    }

    var maxEnd = new Date(upperBoundary);
    
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        var reservationEnd = new Date(item.state.interval.end);

        var isBelowMax = maxEnd > reservationEnd;
        var isOutOfBounds = reservationEnd > upperBoundary;
        if (isBelowMax || isOutOfBounds) {
            continue;
        }
        
        var isOtherTeam = (
            item.state.experimentOperatorTeamId
            !== selectedReservationRecord.state.experimentOperatorTeamId
        );
        if (isOtherTeam) {
            continue;
        }

        // check if continous
        var hasNoGap = (
            maxEnd.getTime() + 1 !== reservationStart.getTime()
        );
        if (hasNoGap) {
            continue;
        }

        maxEnd = reservationEnd;
    }

    var orderedExperiments = (
        experimentRecords
        .filter(it => {
            var expStart = (
                new Date(it.state.interval.start).getTime()
            );
            var selectedStart = (
                new Date(start).getTime()
            );

            return (
                currentExperimentId !== it._id
                && expStart > selectedStart
            );
        })
        .sort((a,b) => {
            var startA = new Date(a.state.interval.start).getTime();
            var startB = new Date(b.state.interval.start).getTime();
            return (
                startA < startB ? -1 : 1
            )
        })
    );
    
    var nextExperiment = orderedExperiments[0];
    if (nextExperiment) {
        var nextExperimentStart = (
            new Date(nextExperiment.state.interval.start)
        );
        if (nextExperimentStart.getTime() < maxEnd.getTime()) {
            maxEnd = new Date(nextExperimentStart.getTime() - 1);
        }
    }
    //console.log({ maxEnd: maxEnd.toISOString() });



    var out = new Date(maxEnd.getTime() + slotDuration);
    return out;
}

export default MoveExperimentModalWrapper;
