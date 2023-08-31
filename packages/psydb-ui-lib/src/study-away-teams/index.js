import React from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    WeeklyCalendar
} from './calendar-variants';

const StudyAwayTeams = (ps) => {
    var {
        variant = 'experiment',
        studyId,
        studyRecordType,
        onlyLocationId,

        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,
        onSelectExperimentPlaceholderSlot,

        className,
        revision = 0,
        calendarRevision = 0,

        withURLSearchParams,
    } = ps;

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
            variant,
            studyId,
            teamData,
            onlyLocationId,
            
            onSelectEmptySlot,
            onSelectReservationSlot,
            onSelectExperimentSlot,
            onSelectExperimentPlaceholderSlot,

            revision: calendarRevision,
            withURLSearchParams,
        }) } />
    )
}

export default StudyAwayTeams;
