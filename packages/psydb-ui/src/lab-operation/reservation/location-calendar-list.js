import React, { useState, useEffect, useReducer, useMemo } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import LocationReservationCalendar from './location-reservation-calendar';

const LocationCalendarList = ({
    studyId,
    locationRecordType,
    teamRecords,
    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    
    var [ calendarData, setCalendarData ] = useState();
    useEffect(() => {
        agent.fetchStudyLocationReservationCalendar({
            studyId,
            locationRecordType,
            start: currentPageStart,
            end: currentPageEnd,
        })
        .then((response) => {
            setCalendarData(response.data.data);
        })
    }, [
        studyId,
        locationRecordType,
        teamRecords,
        currentPageStart,
        currentPageEnd,
    ]);

    if (!calendarData) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    //console.log(currentPageStart, currentPageEnd);

    const {
        locationRecords,
        reservationRecords,
        experimentRecords
    } = calendarData;

    return (
        <>
            { calendarData.locationRecords.map(locationRecord => (
                <LocationReservationCalendar
                    key={ locationRecord._id }
                    { ...({
                        studyId,
                        locationRecord,
                        reservationRecords,
                        experimentRecords,
                        teamRecords,
                        currentPageStart,
                        currentPageEnd,
                        onPageChange,
                    })}
                />
            ))}
        </>
    )
}

const withWeeklyPages = (Component) => (ps) => {
    
    var [ currentPageStart, setCurrentPageStart ] = (
        useState(datefns.startOfWeek(new Date()))
    );

    var handlePageChange = ({ nextIndex, relativeChange }) => {
        var nextWeekStart = undefined;
        if (relativeChange === 'next') {
            nextWeekStart = (
                new Date(datefns.endOfWeek(currentWeekStart.getTime()) + 1)
            )
        }
        else {
            nextWeekStart = datefns.startOfWeek(
                new Date(currentWeekStart.getTime() - 1)
            )
        }
        setCurrentPageStart(currentWeekStart);
    }

    const currentPageEnd = useMemo(() => (
        datefns.endOfWeek(currentPageStart)
    ), [ currentPageStart ]);

    return (
        <Component { ...({
            ...ps,
            currentPageStart,
            currentPageEnd,
            onPageChange: handlePageChange,
        })} />
    )
}

const WrappedLocationCalendarList = withWeeklyPages(LocationCalendarList);
export default WrappedLocationCalendarList;
