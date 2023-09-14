import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

const withGeneralSettingsEditor = (bag) => {
    var {
        title,
        size,

        View,
        Form
    } = bag;

    const ModalBody = (ps) => {
        var { record, onHide, onSuccessfulUpdate } = ps;
        var { _id } = record;

        // NOTE: this can probably be generalzed
        var send = useSend((formData) => ({
            type: 'custom-record-types/set-general-data',
            payload: { id: _id, ...formData }
        }), {
            onSuccessfulUpdate: demuxed([ onSuccessfulUpdate, onHide ])
        })

        return (
            <Form { ...ps } send={ send } />
        )
    }

    const Modal = WithDefaultModal({
        title,
        size,
        Body: ModalBody
    });

    var WrappedView = (ps) => {
        var translate = useUITranslation();
        var modal = useModalReducer();
        return (
            <>
                <View { ...ps } />

                <Modal { ...ps } { ...modal.passthrough } />
                <div className='mt-3'>
                    <Button onClick={ modal.handleShow }>
                        { translate('Edit') }
                    </Button>
                </div>
            </>
        )
    }

    return WrappedView;
}

export default withGeneralSettingsEditor;
