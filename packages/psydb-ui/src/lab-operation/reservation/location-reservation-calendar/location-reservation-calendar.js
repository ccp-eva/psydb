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
import CreateModal from './create-modal';
import DeleteModal from './delete-modal';
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
        <div>
            <header>
                { locationRecord._recordLabel }
            </header>

            <CreateModal
                show={ createModalState.showModal }
                onHide={ handleCloseCreateModal }
                studyId={ studyId }
                locationId={ locationRecord._id }
                start={ createModalState.date }
                slotDuration={ createModalState.slotDuration }
                maxEnd={ createModalState.maxEnd }
                teamRecords={ teamRecords }
                onSuccessfulCreate={ () => {} }
            />

            <DeleteModal
                show={ deleteModalState.showModal }
                onHide={ handleCloseDeleteModal }
                studyId={ studyId }
                locationId={ locationRecord._id }
                date={ deleteModalState.date }
                reservationRecords={ reservationRecords }
                teamRecords={ teamRecords }
                onSuccessfulDelete={ () => {} }
            />

            <div>actions</div>

            <TimeTable { ...({
                studyId,
                teamRecords,
                reservationRecords,
                experimentRecords,
                allDayStarts,
                startTimeInt,
                endTimeInt,
                slotDuration: reservationSlotDuration,
                onSelectEmptySlot: handleShowCreateModal,
                onSelectReservationSlot: handleShowDeleteModal,
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
