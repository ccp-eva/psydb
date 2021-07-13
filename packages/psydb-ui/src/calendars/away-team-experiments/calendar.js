import React, { useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';
import omit from '@cdxoo/omit';

import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';
import useRevision from '@mpieva/psydb-ui-lib/src/use-revision';

import getDayStartsInInterval from '@mpieva/psydb-ui-lib/src/get-day-starts-in-interval';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import withWeeklyCalendarPages from '@mpieva/psydb-ui-lib/src/with-weekly-calendar-pages';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';
import DaysContainer from './days-container';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
const groupExperimentsByDayStart = ({ allDayStarts, records }) => {
    var groups = {};
    for (var start of allDayStarts) {
        var startT = start.getTime();
        var endT = datefns.endOfDay(start).getTime();
        groups[startT] = records.filter(it => {
            var expStartT = (
                new Date(it.state.interval.start).getTime()
            )
            return (
                expStartT >= startT
                && expStartT <= endT
            )
        })
    }
    return groups;
}

const AwayTeamCalendar = ({
    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    var { path, url } = useRouteMatch();
    var {
        locationType,
        researchGroupId,
    } = useParams();

    var [ revision, increaseRevision ] = useRevision();
    var [ query, updateQuery ] = useURLSearchParams();
    // TODO: study selection
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchLocationExperimentCalendar({
            //experimentType: 'away-team',
            locationType,
            researchGroupId,
            
            interval: {
                start: currentPageStart,
                end: currentPageEnd,
            },
        });
    }, [ currentPageStart, currentPageEnd ])

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        experimentRecords,
        experimentRelated,
        experimentOperatorTeamRecords,
        
        locationRecordsById,
        locationRelated,
        locationDisplayFieldData
    } = fetched.data;

    var experimentsByDayStart = groupExperimentsByDayStart({
        allDayStarts,
        records: experimentRecords
    });

    return (
        <div>

            <CalendarNav { ...({
                className: 'mt-3 mr-5 ml-5',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />

            <hr className='mt-1 mb-3' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>
            
            <DaysContainer { ...({
                allDayStarts,
                experimentsByDayStart,

                experimentRelated,
                experimentOperatorTeamRecords,
                locationRecordsById,
                locationRelated,
                locationDisplayFieldData,
                
                url,
                //onSuccessfulUpdate: handleSuccessfulUpdate
            }) } />
        </div>
    )
}

const WrappedAwayTeamCalendar = (
    withWeeklyCalendarPages(AwayTeamCalendar, { withURLSearchParams: true })
);

export default WrappedAwayTeamCalendar;
