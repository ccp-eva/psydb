import React, { useMemo } from 'react';

import useFetch from '../use-fetch';
import getDayStartsInInterval from '../get-day-starts-in-interval';
import withWeeklyCalendarPages from '../with-weekly-calendar-pages';

import CalendarNav from '../calendar-nav';
import LoadingIndicator from '../loading-indicator';

import TimeTableHead from './time-table-head';
import TeamTimeTable from './team-time-table';

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

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    var [ didFetch, state ] = useFetch((agent) => {
        return agent.fetchStudyAwayTeamReservationCalendar({
            studyId,
            start: currentPageStart,
            end: currentPageEnd,
        })
    }, [ studyId, currentPageStart, currentPageEnd ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        reservationRecords,
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
            
            <TimeTableHead { ...({
                allDayStarts,
            }) }/>
            { teamData.records.map(teamRecord => {
                return <TeamTimeTable { ...({
                    key: teamRecord._id,
                    teamRecord,

                    allDayStarts,
                    reservationRecords,
                    experimentRecords,

                    onSelectEmptySlot,
                    onSelectReservationSlot,
                    onSelectExperimentSlot,
                })} />
            })}

        </div>
    )
}

export const WeeklyCalendar = withWeeklyCalendarPages(Calendar);
