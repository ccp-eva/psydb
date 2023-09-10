import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
    
    var translate = useUITranslation();

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
                    <b>{ translate('Really remove this Subject from the Appointment?')}</b>
                </header>
                <i>{ translate('This will remove the subject from the appointment completely!')}</i>
            </Alert>
            <div className='py-2 px-3 bg-white border mb-3'>
                <header><b>{ translate('Subject') }</b></header>
                { subjectRecord._recordLabel }
            </div>
            <div className='d-flex justify-content-end'>
                <Button
                    variant='danger'
                    onClick={ () => send.exec() }
                >
                    { translate('Remove') }
                </Button>
            </div>
        </div>
    );
}

export const RemoveSubjectManualModal = WithDefaultModal({
    title: 'Remove Subject from Appointment',
    size: 'lg',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: RemoveSubjectManualModalBody,
});

