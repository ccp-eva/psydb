import React from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

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

    withURLSearchParams,
}) => {
    var [ didFetch, state ] = useFetchAll((agent) => {
        
        var fetchTeams = agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        });

        return {
            fetchTeams
        }
    }, [ studyId, revision ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var {
        fetchTeams: { data: teamData },
    } = state;

    return (
        <WeeklyCalendar { ...({
            studyId,
            teamData,
            
            onSelectEmptySlot,
            onSelectReservationSlot,
            onSelectExperimentSlot,

            revision: calendarRevision,
            withURLSearchParams,
        }) } />
    )
}

export default StudyAwayTeams;
