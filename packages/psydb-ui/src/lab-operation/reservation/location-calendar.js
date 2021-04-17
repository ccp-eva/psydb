import React, { useState, useEffect } from 'react';
import { startOfWeek } from 'date-fns';

import {
    useRouteMatch,
} from 'react-router-dom';

import {
    Container,
    Col,
    Row,
} from 'react-bootstrap';

var range = n => [ ...Array(n).keys() ]

const LocationCalendar = ({
    locationRecord,
    studyId,
}) => {
    var { path, url } = useRouteMatch();

    var [ currentWeekStart, setCurrentWeekStart ] = (
        useState(startOfWeek(new Date()))
    );

    var handleDateChange = ({ nextDate }) => {
        setCurrentWeekStart(nextDate);
    }

    console.log(locationRecord);

    var {
        canBeReserved,
        canBeReservedByResearchGroupIds,
        disabledForReservationIntervals,
        possibleReservationTimeInterval,
        reservationSlotDuration,
    } = locationRecord.state.reservationSettings;

    var {
        start: startTimeInt,
        end: endTimeInt
    } = possibleReservationTimeInterval;

    return (
        <>
            <div>actions</div>
            <Container>
                <Row>
                    { range(7).map(it => (
                        <Col key={ it }>
                            <TimeSlots
                                weekday={ it }
                                startTimeInt={ startTimeInt }
                                endTimeInt={ endTimeInt }
                            />
                        </Col>
                    )) }
                </Row>
            </Container>
        </>
    );
}

const TimeSlots = ({
    weekday,
    startTimeInt,
    endTimeInt,
}) => {
    return (
        <div>{weekday}</div>
    )
}

export default LocationCalendar;
