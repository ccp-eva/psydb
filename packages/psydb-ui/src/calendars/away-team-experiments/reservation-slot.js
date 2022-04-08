import React from 'react';

const ReservationSlot = ({
    reservationRecord,
    experimentOperatorTeamRecords,
    style,
}) => {

    var { state: {
        experimentOperatorTeamId,
        interval,
    }} = reservationRecord;

    var isInPast = new Date().getTime() > new Date(interval.end).getTime();
    // TODO: we need a flag for isRoot() to view them
    // TODO: we might also want to send a flag to api
    // so we dont send dent data of those at all
    if (isInPast) {
        return null;
    }
    

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
