import React from 'react';
import {
    checkIsWithin3Days,
    checkShouldEnableCalendarSlotTypes,
} from '@mpieva/psydb-common-lib';
import { Container, Row, Col } from 'react-bootstrap';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../date-fns';

const TimeTableHead = ({
    variant,
    allDayStarts,
    showPast,
}) => {
    var permissions = usePermissions();
    var canCreateReservationsWithinTheNext3Days = (
        permissions.hasFlag('canCreateReservationsWithinTheNext3Days')
    );
    var canCreateExperimentsWithinTheNext3Days = (
        permissions.hasFlag('canCreateExperimentsWithinTheNext3Days')
    );
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
                    var dayNoon = datefns.add(dayStart, { hours: 12 }); 
                    
                    var enabledSlotTypes = checkShouldEnableCalendarSlotTypes({
                        permissions, calendarVariant: variant, refDate: dayNoon
                    });
                    var now = new Date();
                    var isInPast = now.getTime() > dayEnd.getTime();
                    var isWithin3days = checkIsWithin3Days(dayEnd);

                    var shouldEnable = (
                        showPast || enabledSlotTypes[variant]
                    );
                    if ([6,7].includes(dayIndex)) {
                        shouldEnable = false;
                    }
                    
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
