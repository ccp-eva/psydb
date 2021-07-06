import React from 'react';

import useFetch from '../use-fetch';
import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
import CalendarNav from '../calendar-nav';
import LoadingIndicator from '../loading-indicator';

import TeamSlots from './team-slots';

export const Calendar = ({
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
    var studyId = studyData.record._id;

    var [ didFetch, state ] = useFetch((agent) => {
        return agent.fetchStudyAwayTeamReservationCalendar({
            studyId,
            start: currentPageStart,
            end: currentPageEnd,
        })
    }, [ studyId ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        reservationRecord,
        experimentRecords
    } = state;

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

export const WeeklyCalendar = withWeeklyCalendarPages(Calendar);
