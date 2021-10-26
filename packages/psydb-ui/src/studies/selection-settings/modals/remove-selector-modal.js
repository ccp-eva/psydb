import React from 'react';

import { createSend, demuxed } from '@mpieva/psydb-ui-utils';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

const RemoveSelectorModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,
        subjectTypeMap,

        onSuccessfulUpdate,
    } = ps;

    var { index, selectorRecord } = modalPayloadData;
    var { _id: selectorId, subjectTypeKey } = selectorRecord;


    var handleSubmit = createSend(() => ({
        type: `subjectSelector/remove`,
        payload: { id: selectorId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <div>
            <div className='text-danger mb-2'>
                <b>
                    Auswahlbedingungen für diesen
                    {' '}Probandentyp wirklich löschen?
                </b>
            </div>
            <div className='p-3 border bg-white'>
                { subjectTypeMap[subjectTypeKey].state.label }
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button selector='danger' onClick={ handleSubmit }>
                    Löschen
                </Button>
            </div>
        </div>
    );
}

const RemoveSelectorModal = WithDefaultModal({
    title: 'Probandentyp löschen',
    size: 'lg',

    Body: RemoveSelectorModalBody
});

export default RemoveSelectorModal;
