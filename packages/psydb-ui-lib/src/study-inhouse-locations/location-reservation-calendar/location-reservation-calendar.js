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

import datefns from '../../date-fns';
import getDayStartsInInterval from '../../get-day-starts-in-interval';

import TimeSlotList from './time-slot-list';

var range = n => [ ...Array(n).keys() ]

const createModalReducer = (state, action) => {
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

const deleteModalReducer = (state, action) => {
    switch(action.type) {
        case 'open':
            return ({
                ...state,
                showModal: true,
                date: action.payload.date,
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

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    className,
}) => {
    var { path, url } = useRouteMatch();

    var [ createModalState, dispatchCreateModalAction ] = (
        useReducer(createModalReducer, {
            showModal: false
        })
    );

    var handleShowCreateModal = ({ date, slotDuration, maxEnd }) => {
        dispatchCreateModalAction({
            type: 'open',
            payload: { date, slotDuration, maxEnd }
        })
    }

    var handleCloseCreateModal = () => {
        dispatchCreateModalAction({
            type: 'close',
        });
    }

    var [ deleteModalState, dispatchDeleteModalAction ] = (
        useReducer(deleteModalReducer, {
            showModal: false
        })
    );

    var handleShowDeleteModal = ({ date }) => {
        dispatchDeleteModalAction({
            type: 'open',
            payload: { date }
        })
    }

    var handleCloseDeleteModal = () => {
        dispatchDeleteModalAction({
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
        <div className={ className }>
            <h5 className='pl-3 pt-2 pb-2 m-0 bg-light'>
                <u>Raum: { locationRecord._recordLabel }</u>
            </h5>
            <TimeTable { ...({
                studyId,
                locationRecord,
                teamRecords,
                reservationRecords,
                experimentRecords,
                allDayStarts,
                startTimeInt,
                endTimeInt,
                slotDuration: reservationSlotDuration,
                onSelectEmptySlot,
                onSelectReservationSlot,
                onSelectExperimentSlot,
            })} />

        </div>
    );
}

const TimeTable = ({ allDayStarts, ...other }) => (

    <Container>
        <Row>
            { allDayStarts.map(dayStart => (
                <Col
                    key={ dayStart.getTime() }
                    className='p-0'
                >
                    <TimeSlotList
                        { ...other }
                        dayStart={ dayStart }
                    />
                </Col>
            )) }
        </Row>
    </Container>

)

export default LocationCalendar;
