import React from 'react';

import {
    Container,
    Col,
    Row,
} from 'react-bootstrap';

import TimeSlotList from './time-slot-list';

const LocationTimeTable = ({ allDayStarts, ...other }) => (
    <Container>
        <Row>
            { allDayStarts.map(dayStart => (
                <Col
                    key={ dayStart.getTime() }
                    className='p-0'
                >
                    <TimeSlotList
                        { ...other }
                        dayStart={ dayStart }
                    />
                </Col>
            )) }
        </Row>
    </Container>
)

export default LocationTimeTable;
