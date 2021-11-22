import React from 'react';

import datefns from '../../../date-fns';
import getTextColor from '../../../bw-text-color-for-background';

import OtherStudySlot from './other-study-slot';

const ReservationSlot = (ps) => {
    var {
        timestamp,
        reservationRecord,

        slotDuration,
        studyId,
        locationRecord,
        teamRecords,

        onSelectReservationSlot,
    } = ps;
    
    var date = new Date(timestamp);

    var teamRecord = teamRecords.find(it => (
        it._id === reservationRecord.state.experimentOperatorTeamId
    ));

    // this reservation does not belong to any of the study teams
    if (!teamRecord) {
        return <OtherStudySlot />
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
