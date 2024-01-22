import React from 'react';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

const ParticipationRemoveModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { _id } = modalPayloadData;

    var send = useSend((formData) => ({
        type: 'subject/remove-participation',
        payload: {
            participationId: _id,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]});

    return (
        <>
            <div>
                Diese Teilnahme wirklich löschen?
            </div>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button variant='danger' size='sm' onClick={ send.exec }>
                    Löschen
                </Button>
            </div>

        </>
    );
}

const ParticipationRemoveModal = WithDefaultModal({
    title: 'Teilnahme löschen',
    size: 'lg',

    Body: ParticipationRemoveModalBody
});

export default ParticipationRemoveModal;
