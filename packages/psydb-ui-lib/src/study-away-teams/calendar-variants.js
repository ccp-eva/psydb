import React, { useState, useMemo } from 'react';

import {
    useFetch,
    usePermissions,
    useToggleReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    ToggleButtons
} from '@mpieva/psydb-ui-layout';

import getDayStartsInInterval from '../get-day-starts-in-interval';
import withWeeklyCalendarPages from '../with-weekly-calendar-pages';

import CalendarNav from '../calendar-nav';

import TimeTableHead from './time-table-head';
import TeamTimeTable from './team-time-table';

export const Calendar = ({
    studyId,
    teamData,
    
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
    onSelectExperimentPlaceholderSlot,

    className,
    revision = 0,

    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    var permissions = usePermissions();
    var showPast = useToggleReducer(false, { as: 'props' });

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
    }, [ studyId, currentPageStart, currentPageEnd, revision ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        reservationRecords,
        experimentRecords
    } = state.data;

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
            <div className='border-bottom'>
                {
                    teamData.records
                    .filter(it => !it.state.hidden)
                    .map(teamRecord => {
                        return <TeamTimeTable { ...({
                            key: teamRecord._id,
                            teamRecord,

                            allDayStarts,
                            reservationRecords,
                            experimentRecords,

                            onSelectEmptySlot,
                            onSelectReservationSlot,
                            onSelectExperimentSlot,
                            onSelectExperimentPlaceholderSlot,

                            showPast: showPast.value
                        })} />
                    })
                }
            </div>

            { permissions.isRoot() && (
                <div className='mt-3'>
                    <ToggleButtons.ShowPast { ...showPast } />
                </div>
            )}
        </div>
    )
}

export const WeeklyCalendar = withWeeklyCalendarPages(Calendar, {
    withURLSearchParams: true
});
