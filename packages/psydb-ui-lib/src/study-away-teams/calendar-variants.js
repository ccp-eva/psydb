import React, { useState, useMemo } from 'react';
import { sliceDays } from '@mpieva/psydb-date-interval-fns';

import {
    useFetch,
    usePermissions,
    useToggleReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    Legend,
    NarrowHR,
    LoadingIndicator,
    ToggleButtons
} from '@mpieva/psydb-ui-layout';

import TeamNameAndColor from '../team-name-and-color';

import getDayStartsInInterval from '../get-day-starts-in-interval';
import withWeeklyCalendarPages from '../with-weekly-calendar-pages';

import CalendarNav from '../calendar-nav';

import TimeTableHead from './time-table-head';
import TeamTimeTable from './team-time-table';

export const Calendar = (ps) => {
    var {
        variant,
        studyId,
        teamData,
        onlyLocationId,
        
        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,
        onSelectExperimentPlaceholderSlot,

        className,
        revision = 0,

        currentPageStart,
        currentPageEnd,
        onPageChange,
    } = ps;

    var permissions = usePermissions();
    var showPast = useToggleReducer(false, { as: 'props' });

    // FIXME: does that memo do anything? bc
    // deps are dates
    var allDays = useMemo(() => sliceDays({
        start: currentPageStart,
        end: currentPageEnd
    }), [ currentPageStart, currentPageEnd ]);

    var allDayStarts = allDays.map(it => it.start);

    var [ didFetch, state ] = useFetch((agent) => {
        return agent.fetchStudyAwayTeamReservationCalendar({
            studyId,
            start: currentPageStart,
            end: currentPageEnd,
        })
    }, [ studyId, currentPageStart, currentPageEnd, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
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
            
            <NarrowHR />

            <TimeTableHead { ...({
                variant,
                allDays,
                showPast: showPast.value,
            }) }/>
            <div className='border-bottom'>
                {
                    teamData.records
                    .filter(it => !it.state.hidden)
                    .map(teamRecord => {
                        return <TeamTimeTable { ...({
                            key: teamRecord._id,
                            variant,
                            teamRecord,
                            onlyLocationId,

                            allDays,
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

            <Legend className='mt-3'>
                {
                    teamData.records
                    .filter(it => !it.state.hidden)
                    .map((teamRecord, ix) => (
                        <TeamNameAndColor
                            key={ ix }
                            className='my-1'
                            teamRecord={ teamRecord }
                        />
                    ))
                }
            </Legend>

            { permissions.isRoot() && (
                <div className='mt-3'>
                    <ToggleButtons.ShowPast { ...showPast } />
                </div>
            )}
        </div>
    )
}

const TeamLabel = (ps) => {
    var { teamRecord } = ps;
    return (
        <div className='d-flex align-items-center'>
            <div
                className='m-1 mr-2'
                style={{
                    width: '30px',
                    height: '26px',
                    backgroundColor: teamRecord.state.color
                }}
            >
            </div>
            <span>{ teamRecord.state.name }</span>
        </div>
    )
}

export const WeeklyCalendar = withWeeklyCalendarPages(Calendar, {
    withURLSearchParams: true
});
