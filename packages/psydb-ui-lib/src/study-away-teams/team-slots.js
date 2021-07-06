import React from 'react';

const TeamSlots = ({
    teamRecord,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    return (
        <div>
            { teamRecord.state.name }
        </div>
    )
}

export default TeamSlots;
