import React from 'react';

import { createSend, demuxed } from '@mpieva/psydb-ui-utils';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
//import * as Items from '../ageFrame-items';

const RemoveAgeFrameModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var { ageFrameRecord } = modalPayloadData;
    var { _id: ageFrameId, type: selectorType } = ageFrameRecord;

    var handleSubmit = createSend(() => ({
        type: `experiment-selector-ageFrame/remove`,
        payload: { id: ageFrameId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <div>
            <div className='text-danger mb-2'>
                <b>Dieses Altersfenster wirklich löschen?</b>
            </div>
            <div className='bg-white'>
                <AgeFrameItem
                    { ...modalPayloadData }
                    showButtons={ false }
                />
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button selector='danger' onClick={ handleSubmit }>
                    Löschen
                </Button>
            </div>
        </div>
    );
}

const RemoveAgeFrameModal = WithDefaultModal({
    title: 'Einstellungen löschen',
    size: 'lg',

    Body: RemoveAgeFrameModalBody
});

export default RemoveAgeFrameModal;
