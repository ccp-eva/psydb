import React from 'react';
import datefns from '../../../date-fns';

const EmptySlot = (ps) => {
    var {
        timestamp,

        slotDuration,
        studyRecord,
        locationRecord,
        teamRecords,

        onSelectEmptySlot,
    } = ps;

    var { _id: studyId } = studyRecord;
    var date = new Date(timestamp);
    
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
        </div>
    );
}

export default EmptySlot;
