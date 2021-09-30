import React from 'react';

import datefns from '../../../date-fns';
import getTextColor from '../../../bw-text-color-for-background';

const ReservationSlot = (ps) => {
    var {
        timestamp,
        reservationRecord,

        slotDuration,
        studyRecord,
        locationRecord,
        teamRecords,

        onSelectReservationSlot,
    } = ps;
    
    var { _id: studyId } = studyRecord;
    var date = new Date(timestamp);

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

export default ReservationSlot;
