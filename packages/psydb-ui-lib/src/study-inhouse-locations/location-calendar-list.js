import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import datefns from '../date-fns';
import LoadingIndicator from '../loading-indicator';
import CalendarNav from '../calendar-nav';

import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
import LocationReservationCalendar from './location-reservation-calendar';

const LocationCalendarList = ({
    studyRecord,
    subjectRecordType,
    locationRecordType,
    teamRecords,
    
    currentPageStart,
    currentPageEnd,
    onPageChange,
   
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    className,

    // used to force reloading the calendar data
    revision = 0,
}) => {
    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchStudyLocationReservationCalendar({
            locationRecordType,
            studyId: studyRecord._id,
            start: currentPageStart,
            end: currentPageEnd,
        })
    }, [
        studyRecord,
        locationRecordType,
        teamRecords,
        currentPageStart,
        currentPageEnd,
        revision,
    ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        locationRecords,
        reservationRecords,
        experimentRecords
    } = fetched.data;

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
            { locationRecords.map(locationRecord => (
                <LocationReservationCalendar
                    key={ locationRecord._id }
                    { ...({
                        studyRecord,
                        locationRecord,
                        reservationRecords,
                        experimentRecords,
                        teamRecords,

                        currentPageStart,
                        currentPageEnd,
                        onPageChange,
    
                        subjectRecordType,

                        onSelectEmptySlot,
                        onSelectReservationSlot,
                        onSelectExperimentSlot,
                    })}
                />
            ))}
        </div>
    )
}
const WrappedLocationCalendarList = withWeeklyCalendarPages(LocationCalendarList);
export default WrappedLocationCalendarList;
