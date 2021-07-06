import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TeamTimeTable = ({
    teamRecord,
    allDayStarts,

    reservationRecords,
    experimentRecords,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    /*var keyedExperiments = keyBy({
        items: experimentRecords,
        pointer: '/state/interval/start'
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
                { allDayStarts.map(dayStart => (
                    <Col
                        key={ dayStart.getTime() }
                        className='p-0'
                    >
                        <TimeSlot {...({
                            teamRecord,

                            onSelectEmptySlot,
                            onSelectReservationSlot,
                            onSelectExperimentSlot,
                        }) } />
                    </Col>
                )) }
            </Row>
        </Container>
    )
}

const TimeSlot = ({
    teamRecord,
    reservationRecord,
    experimentRecord,
    
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    if (experimentRecord) {
        return ( <div>EXP</div> );
    }
    else if (reservationRecord) {
        return ( <div>RES</div> );
    }
    else {
        return (
            <EmptySlot { ...({
                teamRecord,
                onSelectEmptySlot,
            }) } />
        );
    }
}

const EmptySlot = ({
    teamRecord,
    onSelectEmptySlot,
}) => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'empty',
    ];
    var role = '';
    var onClick = undefined;
    
    if (onSelectEmptySlot) {
        classNames.push('selectable');
        role = 'button';
    }

    return (
        <div
            role={ role }
            className={ classNames.join(' ') }
            style={{
                height: '26px',
            }}
        />
    )
}

export default TeamTimeTable;
