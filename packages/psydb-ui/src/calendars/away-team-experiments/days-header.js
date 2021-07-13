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
                    { allDayStarts.map(dayStart => (
                        <Col
                            key={ dayStart.getTime() }
                            className='p-1'
                        >
                            <header className='text-center border-bottom mb-2'>
                                <div
                                    role={ role }
                                    onClick={ onClick && (() => onClick(dayStart)) }
                                >
                                    <b>{ datefns.format(dayStart, 'cccccc dd.MM.') }</b>
                                </div>
                            </header>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default DaysHeader;
