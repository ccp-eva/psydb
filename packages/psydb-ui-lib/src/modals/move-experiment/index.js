import React from 'react';

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
    WithDefaultModal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import StudyInhouseLocations from '../../study-inhouse-locations';
import StudyAwayTeams from '../../study-away-teams';

import InhouseConfirmModal from './inhouse-confirm-modal';
import AwayTeamConfirmModal from './away-team-confirm-modal';
import createCalculateNewExperimentMaxEnd from './create-calculate-new-experiment-max-end';

const RescheduleExperimentModalBody = (ps) => {
    var {
        onHide,

        shouldFetch,
        experimentId,
        experimentType,

        experimentData,
        teamData,
        studyData,

        onSuccessfulUpdate,
    } = ps;

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

    var [ didFetchTestability, fetchedTestability ] = useFetch((agent) => {
        if (didFetch) {
        
            experimentData = experimentData || fetched.data.experimentData;
            studyData = studyData || fetched.data.studyData;
            var studyId = studyData.record._id;
            var subjectIds = experimentData.record.state.subjectData.map(
                it => it.subjectId
            );

            return agent.fetchSubjectPossibleTestIntervals({
                studyId,
                subjectIds,
                labProcedureTypeKey: experimentType,
            })
        }
    }, [ experimentType, didFetch ]);

    if (shouldFetch && !didFetch) {
        return null;
    }
    if (!didFetchTestability || !fetchedTestability.data) {
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

                testableIntervals: fetchedTestability.data.testableIntervals,
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
                testableIntervals: fetchedTestability.data.testableIntervals,

                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            }) } />
        );
    }

    return (
        <>
            { prerenderedConfirmModal }
            { prerenderedCalendar }
        </>
    )
}

const RescheduleExperimentModal = WithDefaultModal({
    Body: RescheduleExperimentModalBody,

    size: 'xl',
    title: 'Reschedule Appointment',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default RescheduleExperimentModal;
