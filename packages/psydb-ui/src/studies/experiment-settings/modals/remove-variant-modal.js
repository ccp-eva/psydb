import React from 'react';

import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

const RemoveVariantModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var { index, variantRecord } = modalPayloadData;
    var { _id: variantId, type: variantType } = variantRecord;


    var send = useSend(() => ({
        type: `experiment-variant/remove`,
        payload: { id: variantId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <div>
            <div className='text-danger mb-2'>
                <b>Diesen Ablauf wirklich löschen?</b>
            </div>
            <div className='p-3 border bg-white'>
                Ablauf { index + 1}
                {' - '}
                { variantsEnum.mapping[variantType] }
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button variant='danger' onClick={ send.exec }>
                    Löschen
                </Button>
            </div>
        </div>
    );
}

const RemoveVariantModal = WithDefaultModal({
    title: 'Einstellungen löschen',
    size: 'lg',

    Body: RemoveVariantModalBody
});

export default RemoveVariantModal;
