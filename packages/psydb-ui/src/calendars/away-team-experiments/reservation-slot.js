import React from 'react';

const ReservationSlot = ({
    reservationRecord,
    experimentOperatorTeamRecords,
    style,
}) => {

    var { state: {
        experimentOperatorTeamId,
    }} = reservationRecord;

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));
   
    return (
        <div className='mb-2' style={{
            background: teamRecord.state.color,
            ...style
        }} />
    );
}

export default ReservationSlot;
