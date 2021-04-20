import React, { useState, useEffect, useReducer } from 'react';

import {
    useRouteMatch,
} from 'react-router-dom';

import {
    Container,
    Col,
    Row,
} from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import LocationModal from './location-modal';

var range = n => [ ...Array(n).keys() ]

const reservationModalReducer = (state, action) => {
    switch(action.type) {
        case 'open':
            return ({
                ...state,
                showModal: true,
                date: action.payload.date,
                slotDuration: action.payload.slotDuration,
                maxEnd: action.payload.maxEnd,
            });
        case 'close':
            return ({
                ...state,
                showModal: false
            })
    }
}

const LocationCalendar = ({
    locationRecord,
    teamRecords,
    studyId,
}) => {
    var { path, url } = useRouteMatch();

    var [ currentWeekStart, setCurrentWeekStart ] = (
        useState(datefns.startOfWeek(new Date()))
    );

    var handleDateChange = ({ nextDate }) => {
        setCurrentWeekStart(nextDate);
    }

    var [ modalState, dispatchModalAction ] = (
        useReducer(reservationModalReducer, {
            showModal: false
        })
    );

    var handleShowModal = ({ date, slotDuration, maxEnd }) => {
        dispatchModalAction({
            type: 'open',
            payload: {
                date,
                slotDuration,
                maxEnd
            }
        })
    }

    var handleCloseModal = () => {
        dispatchModalAction({
            type: 'close',
        });
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
            <LocationModal
                show={ modalState.showModal }
                onHide={ handleCloseModal }
                studyId={ studyId }
                locationId={ locationRecord._id }
                start={ modalState.date }
                slotDuration={ modalState.slotDuration }
                maxEnd={ modalState.maxEnd }
                teamRecords={ teamRecords }
            />

            <div>actions</div>
            <Container>
                <Row>
                    { range(7).map(it => (
                        <Col key={ it }>
                            <TimeSlots
                                studyId={ studyId }
                                weekStart={ currentWeekStart  }
                                weekdayIndex={ it }
                                startTimeInt={ startTimeInt }
                                endTimeInt={ endTimeInt }
                                slotDuration={ reservationSlotDuration }
                                onSelectSlot={ handleShowModal }
                            />
                        </Col>
                    )) }
                </Row>
            </Container>
        </>
    );
}

const TimeSlots = ({
    studyId,
    weekStart,
    weekdayIndex,
    startTimeInt,
    endTimeInt,
    slotDuration,
    onSelectSlot,
}) => {
    var day = datefns.setDay(weekStart, weekdayIndex + 1);
    var dayStart = datefns.startOfDay(day);
    var start = new Date(dayStart.getTime() + startTimeInt);
    var end = new Date(dayStart.getTime() + endTimeInt);

    var slots = [];
    for (var t = start.getTime(); t < end.getTime(); t += slotDuration) {
        slots.push(new Date(t));
    }

    return (
        <div>
            <header>
                <div>{ datefns.format(start, 'cccccc dd.MM.') }</div>
                <div>Uhrzeit</div>
            </header>
            { slots.map((date) => (
                <Slot
                    key={ date.getTime() }
                    date={ date }
                    slotDuration={ slotDuration }
                    studyId={ studyId }
                    onSelect={ (props) => onSelectSlot({
                        ...props,
                        maxEnd: end,
                    }) }
                />
            ))}
        </div>
    )
}

const Slot = ({
    date,
    slotDuration,
    studyId,
    onSelect,
}) => {

    return (
        <div onClick={ () => onSelect({ date, slotDuration }) }>
            { datefns.format(date, 'p') }
        </div>
    );
}

export default LocationCalendar;
