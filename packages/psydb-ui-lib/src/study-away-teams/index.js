import React from 'react';
import useFetchAll from '../use-fetch-all';

import LoadingIndicator from '../loading-indicator';
import {
    WeeklyCalendar
} from './calendar-variants';

const StudyAwayTeams = ({
    studyId,
    studyRecordType,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    className,
    revision = 0,
    calendarRevision = 0,
}) => {
    var [ didFetch, state ] = useFetchAll((agent) => {
        
        var fetchStudy = agent.readRecord({
            collection: 'study',
            recordType: studyRecordType,
            id: studyId,
        });

        var fetchTeams = agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        });

        return {
            fetchStudy,
            fetchTeams
        }
    }, [ studyId, studyRecordType, revision ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var {
        fetchStudy: { data: studyData },
        fetchTeams: { data: teamData },
    } = state;

    return (
        <WeeklyCalendar { ...({
            studyData,
            teamData,
            
            onSelectEmptySlot,
            onSelectReservationSlot,
            onSelectExperimentSlot,

            revision: calendarRevision,
        }) } />
    )
}

export default StudyAwayTeams;
