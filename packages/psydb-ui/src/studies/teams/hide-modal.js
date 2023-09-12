import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';


const HideOpsTeamModalBody = (ps) => {
    var { modalPayloadData, onHide, onSuccessfulUpdate } = ps;
    var teamId = modalPayloadData;

    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/set-visibility',
        payload: { experimentOperatorTeamId: teamId, isVisible: false }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <>
            <div>
                { translate('Really hide this team?') }
            </div>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button
                    size='sm' variant='danger'
                    onClick={ send.exec }
                >
                    { translate('Hide') }
                </Button>
            </div>
        </>
    );
}

const HideOpsTeamModal = WithDefaultModal({
    title: 'Hide Team',
    size: 'md',

    Body: HideOpsTeamModalBody
});

export default HideOpsTeamModal;
