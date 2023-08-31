import React from 'react';

import {
    checkIsWithin3Days,
    checkShouldEnableCalendarSlotTypes,
} from '@mpieva/psydb-common-lib';

import { Container, Row, Col } from 'react-bootstrap';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../date-fns';
import CalendarDayHeader from '../calendar-day-header';

const TimeTableHead = (ps) => {
    var { variant, allDays, showPast } = ps;

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
                <SpacerForTeamColors />

                { allDays.map((day, ix) => {
                    return (
                        <Col key={ ix } className='p-0'>
                            <CalendarDayHeader
                                day={ day }
                                className={ getClassName({
                                    day, showPast,
                                    calendarVariant: variant,
                                    permissions
                                })}
                            />
                        </Col>
                    )
                }) }
            </Row>
        </Container>
    )
}

const getClassName = (bag) => {
    var { day, showPast, calendarVariant, permissions } = bag;
    
    var isDayEnabled = checkIsDayEnabled({
        day, showPast, calendarVariant, permissions
    });
    
    var className = (
        isDayEnabled
        ? 'p-1 text-center bg-light border-bottom'
        : 'p-1 text-center bg-light text-grey border-bottom'
    )

    return className;
}

const checkIsDayEnabled = (bag) => {
    var { day, showPast, calendarVariant, permissions } = bag;

    var dayNoon = datefns.add(day.start, { hours: 12 }); 
    var enabledSlotTypes = checkShouldEnableCalendarSlotTypes({
        permissions, calendarVariant, refDate: dayNoon
    });
   
    var shouldEnable = (
        showPast || enabledSlotTypes[calendarVariant]
    );

    if (checkIsWeekend(day)) {
        shouldEnable = false;
    }

    return shouldEnable;
}

const checkIsWeekend = (day) => {
    var dayIndex = datefns.getISODay(day.start);
    return [6,7].includes(dayIndex);
}

const SpacerForTeamColors = () => {
    return (
        <Col className='p-0 border-bottom bg-light' style={{ flexGrow: 0 }}>
            <div className='m-1' style={{ width: '30px' }}>
            </div>
        </Col>
    )
}

export default TimeTableHead;
