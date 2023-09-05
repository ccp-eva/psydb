import React from 'react';
import { useUILocale } from '@mpieva/psydb-ui-contexts';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

import datefns from '../../../date-fns';

import OtherStudySlot from './other-study-slot';

const ReservationSlot = (ps) => {
    var {
        timestamp,
        reservationRecord,

        slotDuration,
        studyId,
        locationRecord,
        teamRecords,

        checkReservationSlotSelectable,
        onSelectReservationSlot,
    } = ps;
    
    var locale = useUILocale();
    
    var canSelect = (
        checkReservationSlotSelectable
        ? checkReservationSlotSelectable(ps)
        : true
    );

    var date = new Date(timestamp);

    var teamRecord = teamRecords.find(it => (
        it._id === reservationRecord.state.experimentOperatorTeamId
    ));

    // this reservation does not belong to any of the study teams
    if (!teamRecord) {
        return (
            <OtherStudySlot studyLabel={ reservationRecord._studyLabel } />
        )
    }

    return (
        <ColoredBox
            bg={ teamRecord.state.color }
            role={ onSelectReservationSlot ? 'button' : '' }
            className='text-center m-1'
            extraStyle={{
                height: '26px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: teamRecord.state.color
            }}
            onClick={ () => {
                canSelect && onSelectReservationSlot && onSelectReservationSlot({
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
            { datefns.format(date, 'p', { locale }) }
        </ColoredBox>
    );
}

export default ReservationSlot;
