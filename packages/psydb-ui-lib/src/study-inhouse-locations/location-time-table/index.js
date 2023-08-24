import React from 'react';
import { dtoi } from '@mpieva/psydb-date-interval-fns';
import { Container, Col, Row } from '@mpieva/psydb-ui-layout';

import TimeSlotList from './time-slot-list';

const LocationTimeTable = (ps) => {
    var { allDays, ...pass } = ps;
    return (
        <Container>
            <Row>
                { allDays.map((day, ix) => (
                    <Col key={ ix } className='p-0'>
                        <TimeSlotList
                            { ...pass }
                            day={ day }
                            dayStart={ day.start }
                        />
                    </Col>
                )) }
            </Row>
        </Container>
    )
}

export default LocationTimeTable;
