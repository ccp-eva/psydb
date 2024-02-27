import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

const ParticipationRemoveModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { _id } = modalPayloadData;

    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'subject/remove-participation',
        payload: {
            participationId: _id,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]});

    return (
        <>
            <div><b className='text-danger'>
                { translate('Really delete this study participation?') }
            </b></div>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button variant='danger' onClick={ send.exec }>
                    { translate('Delete') }
                </Button>
            </div>

        </>
    );
}

const ParticipationRemoveModal = WithDefaultModal({
    title: 'Delete Study Participation',
    size: 'lg',

    Body: ParticipationRemoveModalBody
});

export default ParticipationRemoveModal;
