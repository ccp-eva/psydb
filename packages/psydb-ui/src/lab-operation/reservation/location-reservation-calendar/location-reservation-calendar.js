import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    useRouteMatch,
} from 'react-router-dom';

import {
    Container,
    Col,
    Row,
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import LocationModal from './location-modal';
import TimeSlotList from './time-slot-list';

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
    studyId,
    locationRecord,
    reservationRecords,
    experimentRecords,
    teamRecords,
    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    var { path, url } = useRouteMatch();

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

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    return (
        <div>
            <header>
                { locationRecord._recordLabel }
            </header>
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
                    { allDayStarts.map(dayStart => (
                        <Col key={ dayStart.getTime() }>
                            <TimeSlotList { ...({
                                studyId,
                                dayStart,
                                startTimeInt,
                                endTimeInt,
                                slotDuration: reservationSlotDuration,
                                onSelectSlot: handleShowModal,
                            })} />
                        </Col>
                    )) }
                </Row>
            </Container>
        </div>
    );
}

const getDayStartsInInterval = ({ start, end }) => {
    var startList = [];

    var currentStart = datefns.startOfDay(start);
    while (currentStart.getTime() < end.getTime()) {
        startList.push(currentStart);
        currentStart = (
            // FIXME: start of day is here for safety since im unsure
            // if dst is properly handled in that case in momentjs it
            // doesnt work for adding weeks and above units
            datefns.startOfDay(datefns.add(currentStart, { days: 1 }))
        );
    }
    
    return startList;
}

export default LocationCalendar;
