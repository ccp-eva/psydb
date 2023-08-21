import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

const AutoProcessButton = (ps) => {
    var { experimentId, onSuccessfulUpdate } = ps;
    
    var translate = useUITranslation();

    var send = useSend(() => ({
        type: 'experiment/auto-process-subjects',
        payload: {
            experimentId,
            participationStatus: 'didnt-participate'
        },
    }), { onSuccessfulUpdate });

    return (
        <Button size='sm' variant='primary' onClick={ send.exec }>
            { translate('Set Remaining to "Not Participated"') }
        </Button>
    )
}

export default AutoProcessButton;
