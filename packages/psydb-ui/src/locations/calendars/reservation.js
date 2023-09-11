import React from 'react';

import { sliceDays } from '@mpieva/psydb-date-interval-fns';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    NarrowHR,
} from '@mpieva/psydb-ui-layout';
import {
    LocationTimeTable,
    CalendarNav,
    CalendarTeamLegend,
    withCalendarVariantContainer
} from '@mpieva/psydb-ui-lib';

const ReservationCalendarBody = (ps) => {
    var {
        // FIXME: location record type should not be here
        recordType,
        locationId,
        experimentTypes,

        currentPageStart,
        currentPageEnd,
        onPageChange,
        showPast,
    } = ps;

    // FIXME: we should pass the already fetched record down from
    // intra-record-routing if we can ensure that it gets updated properly

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        location: agent.readRecord({
            collection: 'location',
            id: locationId
        }),
        timetable: agent.fetchReservableLocationTimeTable({
            locationIds: [ locationId ],
            start: currentPageStart,
            end: currentPageEnd,
            //showPast, // FIXME
        })
    }), [
        recordType,
        locationId,
        experimentTypes.join(','),

        currentPageStart,
        currentPageEnd,
        showPast,
    ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        location,
        timetable,
    } = fetched._stageDatas;

    var {
        possibleReservationTimeInterval,
        reservationSlotDuration,
    } = location.record.state.reservationSettings;
    
    var {
        start: startTimeInt,
        end: endTimeInt
    } = possibleReservationTimeInterval;

    var allDays = sliceDays({
        start: currentPageStart,
        end: currentPageEnd
    });

    return (
        <div>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />
    
            <NarrowHR />

            <LocationTimeTable { ...({
                variant: 'reservation',
                locationRecord: location.record,

                reservationRecords: timetable.reservationRecords,
                experimentRecords: timetable.experimentRecords,
                teamRecords: timetable.labTeamRecords,
                settingRecords: timetable.labSettingsRecords,
                
                allDays,
                startTimeInt,
                endTimeInt,
                slotDuration: reservationSlotDuration,
                
                showPast,
            }) } />
            
            <CalendarTeamLegend { ...({
                studyRecords: timetable.studyRecords,
                experimentOperatorTeamRecords: timetable.labTeamRecords,
            })} />
        </div>
    )
}

export const ReservationCalendar = (
    withCalendarVariantContainer({
        Calendar: ReservationCalendarBody,
        defaultVariant: 'weekly',
        showVariantSelect: false,
        showStudySelect: false,
    })
);

