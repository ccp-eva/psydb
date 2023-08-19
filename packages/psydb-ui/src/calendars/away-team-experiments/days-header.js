import React from 'react';

import { useUILocale } from '@mpieva/psydb-ui-contexts';
import { Container, Col, Row } from '@mpieva/psydb-ui-layout';
import { datefns, CalendarDayHeader } from '@mpieva/psydb-ui-lib';

const AllDayHeaders = (ps) => {
    var { allDays, onSelectDay, ...pass } = ps;

    return (
        <div { ...pass }>
            <Container style={{ maxWidth: '100%' }}>
                <Row>
                    { allDays.map((day, ix) => (
                        <Col key={ ix } className='p-1'>
                            <CalendarDayHeader
                                day={ day }
                                className={ getClassName({ day }) }
                                onClick={ () => (
                                    onSelectDay && onSelectDay(day.start)
                                )}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

var getClassName = (bag) => {
    var { day } = bag;
    var { start, end } = day;

    var isInPast = new Date().getTime() > end.getTime();
    var dayIndex = datefns.getISODay(start);
    
    var shouldEnable = (
        !isInPast
        // && !([6,7].includes(dayIndex))
    );
    var className = (
        shouldEnable
        ? 'text-center border-bottom mb-2'
        : 'text-center border-bottom mb-2 text-grey'
    )

    return className;
}

export default AllDayHeaders;
