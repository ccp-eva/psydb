import React from 'react';
import datefns from '../../../date-fns';

const EmptySlot = (ps) => {
    var {
        timestamp,
        locale,

        slotDuration,
        studyId,
        locationRecord,
        teamRecords,

        checkEmptySlotSelectable,
        onSelectEmptySlot,
    } = ps;

    var canSelect = (
        checkEmptySlotSelectable
        ? checkEmptySlotSelectable(ps)
        : true
    );

    var date = new Date(timestamp);
    
    return (
        <div
            role={ onSelectEmptySlot ? 'button' : undefined }
            className='border text-center m-1'
            style={{ height: '26px' }}
            onClick={ () => {
                canSelect && onSelectEmptySlot && onSelectEmptySlot({
                    studyId,
                    locationRecord,
                    teamRecords,

                    start: date,
                    slotDuration,
                    //maxEnd,
                })
            }}
        >
            { datefns.format(date, 'p', { locale }) }
        </div>
    );
}

export default EmptySlot;
