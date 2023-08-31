import React, { useMemo } from 'react';
import { sliceDays } from '@mpieva/psydb-date-interval-fns';
import { useRouteMatch } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import TimeTable from '../location-time-table';

const LocationCalendar = (ps) => {
    var {
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

        className,
        showPast,
    } = ps;

    var translate = useUITranslation();
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

    // FIXME: does that memo do anything? bc
    // deps are dates
    var allDays = useMemo(() => sliceDays({
        start: currentPageStart,
        end: currentPageEnd
    }), [ currentPageStart, currentPageEnd ]);

    var filteredReservationRecords = reservationRecords.filter(it => (
        it.state.locationId === locationRecord._id
    ));
    var filteredExperimentRecords = experimentRecords.filter(it => (
        it.state.locationId === locationRecord._id
    ));

    return (
        <div className={ className }>
            <h5 className='pl-3 pt-2 pb-2 m-0 bg-light'>
                <u>
                    { translate('Room') }
                    {': '}
                    { locationRecord._recordLabel }
                </u>
            </h5>
            <TimeTable { ...({
                variant,

                studyId,
                locationRecord,
                teamRecords,
                reservationRecords: filteredReservationRecords,
                experimentRecords: filteredExperimentRecords,

                settingRecords,
                settingRelated,

                allDays,
                startTimeInt,
                endTimeInt,
                slotDuration: reservationSlotDuration,

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
                showPast,
            })} />

        </div>
    );
}

export default LocationCalendar;
