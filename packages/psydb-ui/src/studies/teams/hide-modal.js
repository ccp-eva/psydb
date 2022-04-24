import React from 'react';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';
import { useSend } from '@mpieva/psydb-ui-hooks';


const HideOpsTeamModalBody = (ps) => {
    var { modalPayloadData, onHide, onSuccessfulUpdate } = ps;
    var teamId = modalPayloadData;

    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/set-visibility',
        payload: { experimentOperatorTeamId: teamId, isVisible: false }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <>
            <div>
                Team wirklich ausblenden?
            </div>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button
                    size='sm' variant='danger'
                    onClick={ send.exec }
                >
                    Ausblenden
                </Button>
            </div>
        </>
    );
}

const HideOpsTeamModal = WithDefaultModal({
    title: 'Team ausblenden',
    size: 'md',

    Body: HideOpsTeamModalBody
});

export default HideOpsTeamModal;
