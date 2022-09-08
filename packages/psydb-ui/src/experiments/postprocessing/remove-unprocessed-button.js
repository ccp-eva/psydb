import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

const RemoveUnprocessedButton = (ps) => {
    var { experimentId, onSuccessfulUpdate } = ps;

    var send = useSend(() => ({
        type: 'experiment/auto-process-subjects',
        payload: {
            experimentId,
            participationStatus: 'didnt-participate'
        },
    }), { onSuccessfulUpdate });

    return (
        <Button size='sm' variant='primary' onClick={ send.exec }>
            Verbleibende auf "Nicht Teilgenommen" setzen
        </Button>
    )
}

export default RemoveUnprocessedButton;
