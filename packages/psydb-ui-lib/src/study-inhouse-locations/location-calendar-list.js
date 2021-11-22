import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import CalendarNav from '../calendar-nav';

import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
import LocationReservationCalendar from './location-reservation-calendar';

const LocationCalendarList = ({
    studyId,
    subjectRecordType,
    currentExperimentId,
    currentExperimentType,
    currentSubjectRecord,

    locationRecordType,
    teamRecords,
    
    settingRecords,
    settingRelated,

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
            experimentType: currentExperimentType,
            locationRecordType,
            studyId,
            start: currentPageStart,
            end: currentPageEnd,
            ...(currentSubjectRecord && {
                selectedSubjectId: currentSubjectRecord._id
            })
        })
    }, [
        studyId,
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
                        studyId,
                        locationRecord,
                        reservationRecords,
                        experimentRecords,
                        teamRecords,

                        settingRecords,
                        settingRelated,

                        currentPageStart,
                        currentPageEnd,
                        onPageChange,
    
                        subjectRecordType,
                        currentExperimentId,
                        currentSubjectRecord,

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
