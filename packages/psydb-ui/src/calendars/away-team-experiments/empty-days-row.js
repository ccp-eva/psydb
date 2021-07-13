import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const EmptyDaysRow = ({
    allDayStarts,
    style,
}) => {
    return (
        <div style={ style }>
            <Container style={{ maxWidth: '100%' }}>
                <Row>
                    { allDayStarts.map(dayStart => (
                        <Col
                            key={ dayStart.getTime() }
                            className='p-1'
                        >
                            <div className='text-muted text-center'>
                                <i>Keine Termine</i>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default EmptyDaysRow;
