import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const DaysHeader = ({
    allDayStarts,
    onSelectDay,
    style,
}) => {
    var role = '',
        onClick = undefined;
    if (onSelectDay) {
        role = 'button';
        onClick = onSelect
    }

    return (
        <div style={ style }>
            <Container style={{ maxWidth: '100%' }}>
                <Row>
                    { allDayStarts.map(dayStart => {
                        var dayIndex = datefns.getISODay(dayStart);
                        var dayEnd = datefns.endOfDay(dayStart);
                        var isInPast = new Date().getTime() > dayEnd.getTime();
                        var shouldEnable = (
                            !isInPast
                            // && !([6,7].includes(dayIndex))
                        );
                        var className = (
                            shouldEnable
                            ? 'text-center border-bottom mb-2'
                            : 'text-center text-grey border-bottom mb-2'
                        )
                        return <Col
                            key={ dayStart.getTime() }
                            className='p-1'
                        >
                            <header className={ className }>
                                <div
                                    role={ role }
                                    onClick={ onClick && (() => onClick(dayStart)) }
                                >
                                    <b>{ datefns.format(dayStart, 'cccccc dd.MM.') }</b>
                                </div>
                            </header>
                        </Col>
                    })}
                </Row>
            </Container>
        </div>
    );
};

export default DaysHeader;
