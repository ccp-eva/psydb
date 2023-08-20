import React from 'react';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

const ReservationSlot = (ps) => {
    var {
        reservationRecord,
        experimentOperatorTeamRecords,
        style,
    } = ps;

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
        <ColoredBox
            className='pl-2 pr-2 pb-1 pt-1 mb-2' 
            bg={ teamRecord.state.color }
            extraStyle={ style }
        >
            <div className='text-small'>
                { teamRecord.state.name }
            </div>
        </ColoredBox>
    );
}

export default ReservationSlot;
