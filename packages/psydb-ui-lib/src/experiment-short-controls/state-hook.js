import { useState } from 'react';

const useControlStates = (defaults = {}) => {
    var [ comment, setComment ] = useState(defaults.comment || '');
    var [
        autoConfirm, setAutoConfirm
    ] = useState(defaults.autoConfirm || false);

    var [ end, setEnd ] = useState(
        defaults.end === undefined
        ? new Date(start.getTime() + slotDuration - 1)
        : defaults.end
    );
    var [ teamId, setTeamId ] = useState(defaults.teamId || undefined);

    return {
        comment,
        autoConfirm,
        end,
        teamId,

        onChangeComment: setComment,
        onChangeAutoConfirm: setAutoConfirm,
        onChangeEnd: setEnd,
        onChangeTeamId: setTeamId
    }
}

export default useControlStates
