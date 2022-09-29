import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useFetch, useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    WithDefaultModal,
    LoadingIndicator,
    SplitPartitioned,
    PaddedText,
    Alert
} from '@mpieva/psydb-ui-layout';

const RemoveSubjectManualModalBody = (ps) => {
    var {
        onHide,
        experimentData,
        modalPayloadData,
        onSuccessfulUpdate,
    } = ps;

    var { subjectRecord } = modalPayloadData;

    var send = useSend((formData) => ({
        type: 'experiment/remove-subject-manual',
        payload: {
            experimentId: experimentData.record._id,
            subjectId: subjectRecord._id
        }
    }), { onSuccessfulUpdate: demuxed([
        onHide, onSuccessfulUpdate
    ]) });

    return (
        <div className='mt-3'>

            <Alert variant='danger'>
                <header>
                    <b>Diese Proband:in wirklich aus Termin austragen?</b>
                </header>
                <i>
                    Die Proband:in wird dabei endgültig aus dem Termin
                    entfernt!
                </i>
            </Alert>
            <div className='py-2 px-3 bg-white border mb-3'>
                <header><b>Proband:in</b></header>
                { subjectRecord._recordLabel }
            </div>
            <div className='d-flex justify-content-end'>
                <Button
                    variant='danger'
                    onClick={ () => send.exec() }
                >
                    Austragen
                </Button>
            </div>
        </div>
    );
}

export const RemoveSubjectManualModal = WithDefaultModal({
    title: 'Proband:in austragen',
    size: 'lg',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: RemoveSubjectManualModalBody,
});

