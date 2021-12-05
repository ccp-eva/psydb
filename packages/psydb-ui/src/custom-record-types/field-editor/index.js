import React from 'react';

import {
    Button,
} from '@mpieva/psydb-ui-layout';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { useSend } from '@mpieva/psydb-ui-hooks';

import { ErrorResponseModal } from '@mpieva/psydb-ui-lib/src/modals';

import NewFieldModal from './new-field-modal';
import EditFieldModal from './edit-field-modal';

import FieldList from './field-list';

const FieldEditor = ({ record, onSuccessfulUpdate }) => {

    var newFieldModal = useModalReducer();
    var editFieldModal = useModalReducer();
    var errorModal = useModalReducer();

    var onFailedUpdate = (error) => {
        errorModal.handleShow({ errorResponse: error.response });
    };

    var handleCommitSettings = useSend(() => ({
        type: 'custom-record-types/commit-settings',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
        }
    }), { onSuccessfulUpdate, onFailedUpdate });

    var handleRemoveField = useSend(({ field }) => ({
        type: 'custom-record-types/remove-field-definition',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
            subChannelKey: field.subChannelKey,
            key: field.key
        }
    }), { onSuccessfulUpdate, onFailedUpdate });

    var handleRestoreField = useSend(({ field }) => ({
        type: 'custom-record-types/restore-field-definition',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
            subChannelKey: field.subChannelKey,
            key: field.key
        }
    }), { onSuccessfulUpdate, onFailedUpdate });

    return (
        <div>
            <Button onClick={ newFieldModal.handleShow }>
                Neues Feld
            </Button>

            <NewFieldModal
                { ...newFieldModal.passthrough }
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            
            <EditFieldModal
                { ...editFieldModal.passthrough }
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            
            <ErrorResponseModal
                { ...errorModal.passthrough }
            />

            <FieldList
                record={ record }
                onEditField={ editFieldModal.handleShow }
                onRemoveField={ handleRemoveField.exec }
                onRestoreField={ handleRestoreField.exec }
            />

            <hr />

            <Button
                variant='danger'
                onClick={ handleCommitSettings.exec }
                disabled={
                    !(record.state.isDirty || record.state.isNew)
                }
            >
                Felder fixieren
            </Button>

        </div>
    )
}

export default FieldEditor;
