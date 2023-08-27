import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePermissions,
    useToggleReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    ToggleButtons,
    Legend,
    NarrowHR
} from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import CalendarNav from '../calendar-nav';

import withWeeklyCalendarPages from '../with-weekly-calendar-pages';
import TeamNameAndColor from '../team-name-and-color';
import LocationReservationCalendar from './location-reservation-calendar';

const LocationCalendarList = (ps) => {
    var {
        variant,

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
    } = ps;

    var translate = useUITranslation();
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

            <NarrowHR />

            { locationRecords.map(locationRecord => (
                <LocationReservationCalendar
                    key={ locationRecord._id }
                    { ...({
                        variant,

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
          
            <hr />

            <Legend>
                {
                    teamRecords
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
        </div>
    )
}


const WrappedLocationCalendarList = withWeeklyCalendarPages(
    LocationCalendarList
);
export default WrappedLocationCalendarList;
