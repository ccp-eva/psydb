import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '../../date-fns';
import getTextColor from '../../bw-text-color-for-background';

const TimeSlot = ({
    timestamp,
    reservationRecord,
    experimentRecord,

    slotDuration,
    studyId,
    teamRecords,
    onSelectEmptySlot,
    onSelectReservationSlot,
}) => {
    var date = new Date(timestamp);
    if (experimentRecord) {
        return (
            // TODO
            <div>E</div>
        )
    }
    if (reservationRecord) {
        var teamRecord = teamRecords.find(it => (
            it._id === reservationRecord.state.experimentOperatorTeamId
        ));
        return (
            <div
                style={{
                    background: teamRecord.state.color,
                    color: getTextColor(teamRecord.state.color)
                }}
                onClick={ () => onSelectReservationSlot({
                    date
                })}
            >
                { datefns.format(date, 'p') }
            </div>
        );
    }
    return (
        <div onClick={ () => onSelectEmptySlot({ date, slotDuration }) }>
            { datefns.format(date, 'p') }
            { reservationRecord ? 'R' : '' }
            { experimentRecord ? 'E' : '' }
        </div>
    );
}

export default TimeSlot;
