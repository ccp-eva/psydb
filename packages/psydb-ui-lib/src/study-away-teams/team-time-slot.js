import React, { useCallback } from 'react';

import {
    checkIsWithin3Days,
    checkShouldEnableCalendarSlotTypes,
} from '@mpieva/psydb-common-lib';

import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../date-fns';
import { ExperimentSlot } from './experiment-slot';


const TeamTimeSlot = (ps) => {
    var {
        variant,
        teamRecord,
        onlyLocationId,
        day,
        dayStart,

        reservationRecord,
        experimentRecord,

        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,
        onSelectExperimentPlaceholderSlot,

        showPast
    } = ps;
    
    var permissions = usePermissions();

    var now = new Date();
    var dayIndex = datefns.getISODay(dayStart);
    var dayEnd = datefns.endOfDay(dayStart);
    var dayNoon = datefns.add(dayStart, { hours: 12 });

    var enabledSlotTypes = checkShouldEnableCalendarSlotTypes({
        permissions, calendarVariant: variant, refDate: dayNoon
    });
    
    if (!showPast && !enabledSlotTypes[variant]) {
        return <DisabledSlot />
    }
    if ([6,7].includes(dayIndex)) {
        return <DisabledSlot />
    }

    if (experimentRecord) {
        var end = experimentRecord.state.interval.end;
        var isInPast = now.getTime() > new Date(end).getTime();
        //var isWithin3days = checkIsWithin3Days(dayEnd);
        var shouldEnable = (
            !isInPast
            //&& canCreateExperimentsWithinTheNext3Days ? true : !isWithin3days
            //&& !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <ExperimentSlot { ...({
                teamRecord,
                onlyLocationId,
                reservationRecord,
                experimentRecord,
                dayStart,
                onSelectExperimentSlot,
                onSelectExperimentPlaceholderSlot,
            }) } />
        );
    }
    else if (reservationRecord) {
        var end = reservationRecord.state.interval.end;
        var isInPast = now.getTime() > new Date(end).getTime();
        //var isWithin3days = checkIsWithin3Days(dayEnd);
        var shouldEnable = (
            !isInPast
            //&& canCreateExperimentsWithinTheNext3Days ? true : !isWithin3days
            //&& !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <ReservationSlot { ...({
                teamRecord,
                reservationRecord,
                dayStart,
                onSelectReservationSlot,
            }) } />
        );
    }
    else {
        var isInPast = now.getTime() > dayEnd.getTime();
        //var isWithin3days = checkIsWithin3Days(dayEnd);
        var shouldEnable = (
            !isInPast
            //&& canCreateReservationsWithinTheNext3Days ? true : !isWithin3days
            //&& !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <EmptySlot { ...({
                teamRecord,
                dayStart,
                onSelectEmptySlot,
            }) } />
        );
    }
}


const ReservationSlot = ({
    teamRecord,
    reservationRecord,
    dayStart,
    onSelectReservationSlot,
}) => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'empty',
    ];
    var role = '';

    if (onSelectReservationSlot) {
        classNames.push('selectable');
        role = 'button';
    }

    var onClick = useCallback(() => {
        onSelectReservationSlot && onSelectReservationSlot({
            teamRecord,
            reservationRecord,
            interval: {
                start: dayStart,
                end: datefns.endOfDay(dayStart)
            }
        })
    })

    return (
        <div
            role={ role }
            className={ classNames.join(' ') }
            style={{
                height: '26px',
                backgroundColor: teamRecord.state.color
            }}
            onClick={ onClick }
        />
    )
}

const EmptySlot = ({
    teamRecord,
    dayStart,
    onSelectEmptySlot,
}) => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'empty',
    ];
    var role = '';

    if (onSelectEmptySlot) {
        classNames.push('selectable');
        role = 'button';
    }

    var onClick = useCallback(() => {
        onSelectEmptySlot && onSelectEmptySlot({
            teamRecord,
            interval: {
                start: dayStart,
                end: datefns.endOfDay(dayStart)
            }
        })
    })

    return (
        <div
            role={ role }
            className={ classNames.join(' ') }
            style={{
                height: '26px',
            }}
            onClick={ onClick }
        />
    )
}

const DisabledSlot = () => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'disabled',
        'bg-light'
    ];
    var role = '';

    return (
        <div
            className={ classNames.join(' ') }
            style={{
                height: '26px',
            }}
        />
    )
}

export default TeamTimeSlot;
