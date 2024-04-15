import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

const RemoveSelectorModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,
        availableSubjectCRTs,
        onSuccessfulUpdate,
    } = ps;

    var { index, selectorRecord  } = modalPayloadData;
    var { _id: selectorId, subjectTypeKey } = selectorRecord;
    var subjectCRT = availableSubjectCRTs.find({ type: subjectTypeKey });

    var translate = useUITranslation();

    var send = useSend(() => ({
        type: `subjectSelector/remove`,
        payload: { id: selectorId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <div>
            <div className='text-danger mb-2'>
                <b>
                    { translate('Really delete this subject type from the study?') }
                </b>
            </div>
            <div className='p-3 border bg-white'>
                { translate.crt(subjectCRT) }
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button selector='danger' onClick={ send.exec }>
                    { translate('Delete') }
                </Button>
            </div>
        </div>
    );
}

const RemoveSelectorModal = WithDefaultModal({
    title: 'Delete Subject Type',
    size: 'lg',

    Body: RemoveSelectorModalBody
});

export default RemoveSelectorModal;
