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

const TeamTimeTable = ({
    teamRecord,
    allDayStarts,

    reservationRecords,
    experimentRecords,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {

    var keyedExperiments = keyBy({
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
    });


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
                    var reservationRecord = keyedReservations[k];
                    var experimentRecord = keyedExperiments[k];

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
}) => {
    if (experimentRecord) {
        return (
            <ExperimentSlot { ...({
                teamRecord,
                reservationRecord,
                dayStart,
                onSelectExperimentSlot,
            }) } />
        );
    }
    else if (reservationRecord) {
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
        return (
            <EmptySlot { ...({
                teamRecord,
                dayStart,
                onSelectEmptySlot,
            }) } />
        );
    }
}

const ExperimentSlot = ({
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
                backgroundColor: teamRecord.state.color,
            }}
            onClick={ onClick }
        >
            <Icons.CheckCircleFill style={{
                color: getTextColor(teamRecord.state.color),
                width: '16px',
                height: '16px',
                marginTop: '-5px'
            }} />
        </div>
    )
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

export default TeamTimeTable;
