import React, { useState, useEffect, useReducer, useMemo } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '../date-fns';
import LoadingIndicator from '../loading-indicator';
import CalendarNav from '../calendar-nav';

import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
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
const WrappedLocationCalendarList = withWeeklyCalendarPages(LocationCalendarList);
export default WrappedLocationCalendarList;
