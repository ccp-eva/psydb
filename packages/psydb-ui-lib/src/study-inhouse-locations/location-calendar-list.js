import React, { useState } from 'react';

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
    desiredTestInterval,
    testableIntervals,

    locationRecordType,
    teamRecords,
    
    settingRecords,
    settingRelated,

    currentPageStart,
    currentPageEnd,
    onPageChange,
   
    __useNewCanSelect,
    checkEmptySlotSelectable,
    checkReservationSlotSelectable,
    checkExperimentSlotSelectable,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    calculateNewExperimentMaxEnd,

    className,

    // used to force reloading the calendar data
    revision = 0,
}) => {
    var permissions = usePermissions();
    var showPast = useToggleReducer(false, { as: 'props' });

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
            { permissions.isRoot() && (
                <div className='mt-2'>
                    <ToggleButtons.ShowPast { ...showPast } />
                </div>
            )}
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
                        desiredTestInterval,
                        testableIntervals,

                        __useNewCanSelect,
                        checkEmptySlotSelectable,
                        checkReservationSlotSelectable,
                        checkExperimentSlotSelectable,

                        onSelectEmptySlot,
                        onSelectReservationSlot,
                        onSelectExperimentSlot,

                        calculateNewExperimentMaxEnd,
                        showPast: showPast.value
                    })}
                />
            ))}
        </div>
    )
}
const WrappedLocationCalendarList = withWeeklyCalendarPages(LocationCalendarList);
export default WrappedLocationCalendarList;
