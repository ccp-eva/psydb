import React from 'react';
import useFetchAll from '../use-fetch-all';

import LoadingIndicator from '../loading-indicator';
import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
import CalendarNav from '../calendar-nav';

const StudyAwayTeams = ({
    studyId,
    studyRecordType,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    className,
    revision = 0
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

            className,
        }) } />
    )
}

var Calendar = ({
    studyData,
    teamData,
    
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    className,

    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    return (
        <div className={ className }>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />
            <hr className='mt-1 mb-1' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>
            
            { teamData.records.map(teamRecord => {
                return <TeamSlots { ...({
                    key: teamRecord._id,
                    teamRecord,

                    onSelectEmptySlot,
                    onSelectReservationSlot,
                    onSelectExperimentSlot,
                })} />
            })}

        </div>
    )
}

var WeeklyCalendar = withWeeklyCalendarPages(Calendar);

var TeamSlots = ({
    teamRecord,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    return (
        <div>
            { teamRecord.state.name }
        </div>
    )
}

export default StudyAwayTeams;
