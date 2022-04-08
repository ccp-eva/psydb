import React, { useCallback } from 'react';

import {
    Container,
    Row,
    Col,
    Icons
} from '@mpieva/psydb-ui-layout';

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import datefns from '../date-fns';
import getTextColor from '../bw-text-color-for-background';

import { ExperimentSlot } from './experiment-slot';

var calculateOverlap = (that, other) => {
    // FIXME: breaks when start/end are reversed in that/other
    if (that.end <= other.start || that.start >= other.end) {
        return 0;
    }

    var maxStart = (
        that.start > other.start
        ? that.start
        : other.start
    );
    var minEnd = (
        that.end < other.end
        ? that.end
        : other.end
    );

    return (minEnd - maxStart);
}

var toIntInterval = ({ start, end }) => ({
    start: start.getTime(),
    end: end.getTime(),
});

var toDateInterval = ({ start, end }) => ({
    start: new Date(start),
    end: new Date(end),
})

var spliceWithMaxOverlap = ({ items, interval }) => {
    var maxOverlap = 0;
    var maxIndex = undefined;
    for (var [ index, it ] of items.entries()) {
        var overlap = calculateOverlap(
            toIntInterval(toDateInterval(it.state.interval)),
            toIntInterval(toDateInterval(interval)),
        );
        if (overlap > maxOverlap) {
            maxOverlap = overlap;
            maxIndex = index;
        };
    }
    
    if (maxIndex === undefined) {
        return undefined
    }
    else {
        var it = items.splice(maxIndex, 1)[0];
        return it;
    }
}

const TeamTimeTable = ({
    teamRecord,
    allDayStarts,

    reservationRecords,
    experimentRecords,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
    onSelectExperimentPlaceholderSlot,

    showPast,
}) => {

    var filteredExperiments = experimentRecords.filter(it => (
        it.state.experimentOperatorTeamId === teamRecord._id
    ));
    var filteredReservations = reservationRecords.filter(it => (
        it.state.experimentOperatorTeamId === teamRecord._id
    ));

    var itemsByDayStart = {};
    allDayStarts.forEach(dayStart => {
        var k = dayStart.toISOString();
        
        // FIXME: this is still a hack
        var interval = {
            start: dayStart,
            end: datefns.endOfDay(dayStart)
        };
        var reservationRecord = spliceWithMaxOverlap({
            items: filteredReservations,
            interval
        });
        var experimentRecord = spliceWithMaxOverlap({
            items: filteredExperiments,
            interval
        });

        itemsByDayStart[k] = {
            reservationRecord,
            experimentRecord,
        }
    })


    /*var keyedExperiments = keyBy({
        items: experimentRecords.filter(it => (
            it.state.experimentOperatorTeamId === teamRecord._id
        )),
        byPointer: '/state/interval/start'
    });

    var keyedReservations = keyBy({
        items: reservationRecords.filter(it => (
            it.state.experimentOperatorTeamId === teamRecord._id
        )),
        byPointer: '/state/interval/start'
    });*/


    return (
        <Container>
            <Row>
                <Col className='p-0' style={{
                    flexGrow: 0,
                }}>
                    <div
                        className='m-1'
                        style={{
                            width: '30px',
                            height: '26px',
                            backgroundColor: teamRecord.state.color
                        }}
                    >
                    </div>
                </Col>
                { allDayStarts.map(dayStart => {
                    var k = dayStart.toISOString();
                    
                    var {
                        reservationRecord,
                        experimentRecord,
                    } = itemsByDayStart[k]
                    //var reservationRecord = keyedReservations[k];
                    //var experimentRecord = keyedExperiments[k];

                    return <Col
                        key={ dayStart.getTime() }
                        className='p-0'
                    >
                        <TimeSlot {...({
                            teamRecord,
                            dayStart,

                            reservationRecord,
                            experimentRecord,

                            onSelectEmptySlot,
                            onSelectReservationSlot,
                            onSelectExperimentSlot,
                            onSelectExperimentPlaceholderSlot,

                            showPast
                        }) } />
                    </Col>
                }) }
            </Row>
        </Container>
    )
}

const TimeSlot = ({
    teamRecord,
    dayStart,

    reservationRecord,
    experimentRecord,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
    onSelectExperimentPlaceholderSlot,

    showPast
}) => {
    var dayIndex = datefns.getISODay(dayStart);
    var dayEnd = datefns.endOfDay(dayStart);
    var shouldEnable = !([6,7].includes(dayIndex));

    if (!shouldEnable) {
        return <DisabledSlot />
    }
    else if (experimentRecord) {
        var end = experimentRecord.state.interval.end;
        var isInPast = new Date().getTime() > new Date(end).getTime();
        if (!showPast && isInPast) {
            return <DisabledSlot />
        }
        return (
            <ExperimentSlot { ...({
                teamRecord,
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
        var isInPast = new Date().getTime() > new Date(end).getTime();
        if (!showPast && isInPast) {
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
        var isInPast = new Date().getTime() > dayEnd.getTime();
        if (!showPast && isInPast) {
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
export default TeamTimeTable;
