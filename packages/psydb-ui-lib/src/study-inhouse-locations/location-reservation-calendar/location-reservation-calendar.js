import React, { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';

import getDayStartsInInterval from '../../get-day-starts-in-interval';
import TimeTable from '../location-time-table';

const LocationCalendar = ({
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

    className,
}) => {
    var { path, url } = useRouteMatch();

    var {
        canBeReserved,
        canBeReservedByResearchGroupIds,
        disabledForReservationIntervals,
        possibleReservationTimeInterval,
        reservationSlotDuration,
    } = locationRecord.state.reservationSettings;

    var {
        start: startTimeInt,
        end: endTimeInt
    } = possibleReservationTimeInterval;

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    return (
        <div className={ className }>
            <h5 className='pl-3 pt-2 pb-2 m-0 bg-light'>
                <u>Raum: { locationRecord._recordLabel }</u>
            </h5>
            <TimeTable { ...({
                studyRecord,
                locationRecord,
                teamRecords,
                reservationRecords,
                experimentRecords,
                allDayStarts,
                startTimeInt,
                endTimeInt,
                slotDuration: reservationSlotDuration,

                subjectRecordType,

                onSelectEmptySlot,
                onSelectReservationSlot,
                onSelectExperimentSlot,
            })} />

        </div>
    );
}

export default LocationCalendar;
