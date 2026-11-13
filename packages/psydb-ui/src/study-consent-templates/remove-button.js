import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer, useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal, Button, AsyncButton, Alert
} from '@mpieva/psydb-ui-layout';

// NOTE: shared by consent template and consent form editors;
// the actual usage check happens in the api
export const RemoveButton = (ps) => {
    var {
        title, confirmText, blockedText,
        createMessage, onSuccessfulUpdate
    } = ps;

    var [{ translate }] = useI18N();
    var modal = useModalReducer();

    return (
        <>
            <RemoveModal
                { ...modal.passthrough }
                title={ title }
                confirmText={ confirmText }
                blockedText={ blockedText }
                createMessage={ createMessage }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Button variant='danger' onClick={ () => modal.handleShow() }>
                { translate('Delete') }
            </Button>
        </>
    )
}

const RemoveModalBody = (ps) => {
    var {
        onHide, confirmText, blockedText,
        createMessage, onSuccessfulUpdate
    } = ps;

    var [{ translate }] = useI18N();
    var send = useSend(createMessage, {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <>
            { blockedText ? (
                <Alert variant='danger'><b>{ blockedText }</b></Alert>
            ) : (
                <p>{ confirmText }</p>
            )}
            <div className='d-flex justify-content-end gapx-3'>
                <Button variant='outline-secondary' onClick={ onHide }>
                    { translate('Cancel') }
                </Button>
                <AsyncButton
                    variant='danger'
                    onClick={ send.exec }
                    isTransmitting={ send.isTransmitting }
                    disabled={ !!blockedText }
                >
                    { translate('Delete') }
                </AsyncButton>
            </div>
        </>
    )
}

const RemoveModal = WithDefaultModal({
    size: 'md',
    Body: RemoveModalBody,
});
