import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '../../date-fns';
import getTextColor from '../../bw-text-color-for-background';

const TimeSlot = ({
    timestamp,
    reservationRecord,
    experimentRecord,

    slotDuration,
    studyId,
    locationRecord,
    teamRecords,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    var date = new Date(timestamp);
    if (experimentRecord) {
        var teamRecord = teamRecords.find(it => (
            it._id === experimentRecord.state.experimentOperatorTeamId
        ));
        
        // this reservation does not belong to any of the study teams
        if (!teamRecord) {
            return (
                <div
                    className='border text-center m-1'
                    style={{
                        height: '26px',
                    }}
                >-</div>
            )
        }

        return (
            <div
                role={ onSelectExperimentSlot ? 'button' : undefined }
                className='text-center m-1'
                style={{
                    height: '26px',
                    background: teamRecord.state.color,
                    color: getTextColor(teamRecord.state.color),
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    borderColor: getTextColor(teamRecord.state.color),
                    boxSizing: 'border-box'
                }}
                onClick={ () => {
                    onSelectExperimentSlot && onSelectExperimentSlot({
                        studyId,
                        locationRecord,
                        experimentRecord,
                        start: date,
                        slotDuration,
                        // maxEnd
                    })
                }}
            >
                <b className='d-inline-block pl-1 pr-1' style={{
                    //borderLeft: '4px solid',
                    //borderRight: '4px solid',
                    //borderColor: getTextColor(teamRecord.state.color),
                }}>
                    <u>{ datefns.format(date, 'p') }</u>
                </b>
            </div>
        );
    }
    if (reservationRecord) {
        var teamRecord = teamRecords.find(it => (
            it._id === reservationRecord.state.experimentOperatorTeamId
        ));

        // this reservation does not belong to any of the study teams
        if (!teamRecord) {
            return (
                <div
                    className='border text-center m-1'
                    style={{
                        height: '26px',
                    }}
                >-</div>
            )
        }

        return (
            <div
                role={ onSelectReservationSlot ? 'button' : undefined }
                className='text-center m-1'
                style={{
                    height: '26px',
                    background: teamRecord.state.color,
                    color: getTextColor(teamRecord.state.color),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: teamRecord.state.color
                }}
                onClick={ () => {
                    onSelectReservationSlot && onSelectReservationSlot({
                        studyId,
                        teamRecords,
                        locationRecord,
                        reservationRecord,
                        start: date,
                        slotDuration,
                        // maxEnd
                    })
                }}
            >
                { datefns.format(date, 'p') }
            </div>
        );
    }
    return (
        <div
            role={ onSelectEmptySlot ? 'button' : undefined }
            className='border text-center m-1'
            style={{ height: '26px' }}
            onClick={ () => {
                onSelectEmptySlot && onSelectEmptySlot({
                    studyId,
                    locationRecord,
                    teamRecords,

                    start: date,
                    slotDuration,
                    //maxEnd,
                })
            }}
        >
            { datefns.format(date, 'p') }
            { reservationRecord ? 'R' : '' }
            { experimentRecord ? 'E' : '' }
        </div>
    );
}

export default TimeSlot;
