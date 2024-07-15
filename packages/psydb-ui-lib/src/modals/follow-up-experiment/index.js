import React from 'react';

import enums from '@mpieva/psydb-schema-enums';
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

const FollowUpExperimentModalBody = (ps) => {
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
                onSelectExperimentPlaceholderSlot: confirmModal.handleShow,
                calendarRevision: revision,
                withURLSearchParams: false,
                onlyLocationId: experimentData.record.state.locationId,
            }) } />
        );
        prerenderedConfirmModal = (
            <AwayTeamConfirmModal { ...({
                ...confirmModal.passthrough,

                studyId,
                studyData,
                experimentData,
                teamData,

                onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
            })} />
        )
    }
    else if (enums.inviteLabMethods.keys.includes(experimentType)) {
         prerenderedCalendar = (
            <StudyInhouseLocations { ...({
                studyId,
                studyRecordType,

                //activeLocationType={ 'instituteroom' }
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
        <>
            { prerenderedConfirmModal }
            { prerenderedCalendar }
        </>
    )
}


const FollowUpExperimentModal = WithDefaultModal({
    Body: FollowUpExperimentModalBody,

    size: 'xl',
    title: 'Follow-Up Appointment',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default FollowUpExperimentModal;
