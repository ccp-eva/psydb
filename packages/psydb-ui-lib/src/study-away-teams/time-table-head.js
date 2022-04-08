import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import datefns from '../date-fns';

const TimeTableHead = ({
    allDayStarts,
}) => {
    return (
        <Container>
            <Row>
                <Col className='p-0 border-bottom bg-light' style={{
                    flexGrow: 0,
                }}>
                    <div
                        className='m-1'
                        style={{
                            width: '30px',
                        }}
                    >
                    </div>
                </Col>
                
                { allDayStarts.map(dayStart => {
                    var dayIndex = datefns.getISODay(dayStart);
                    var dayEnd = datefns.endOfDay(dayStart);
                    var isInPast = new Date().getTime() > dayEnd.getTime();
                    var shouldEnable = (
                        !isInPast && !([6,7].includes(dayIndex))
                    );
                    var className = (
                        shouldEnable
                        ? 'p-0 text-center bg-light border-bottom'
                        : 'p-0 text-center bg-light text-grey border-bottom'
                    )
                    return <Col
                        key={ dayStart.getTime() }
                        className={ className }
                    >
                        <b>
                            { datefns.format(dayStart, 'cccccc dd.MM.') }
                        </b>
                    </Col>
                }) }
            </Row>
        </Container>
    )
}

export default TimeTableHead;
