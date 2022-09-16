import React from 'react';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';

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
        <div className='pl-2 pr-2 pb-1 pt-1 mb-2' style={{
            background: teamRecord.state.color,
            color: getTextColor(teamRecord.state.color),
            ...style
        }}>
            <div className='text-small'>
                { teamRecord.state.name }
            </div>
        </div>
    );
}

export default ReservationSlot;
