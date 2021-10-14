import React from 'react';

import {
    Button,
} from '@mpieva/psydb-ui-layout';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';

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

    var handleCommitSettings = createSend(() => ({
        type: 'custom-record-types/commit-settings',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
        }
    }), { onSuccessfulUpdate, onFailedUpdate });

    var handleRemoveField = createSend(({ field }) => ({
        type: 'custom-record-types/remove-field-definition',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
            subChannelKey: field.subChannelKey,
            key: field.key
        }
    }), { onSuccessfulUpdate, onFailedUpdate });

    var handleRestoreField = createSend(({ field }) => ({
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
                onRemoveField={ handleRemoveField }
                onRestoreField={ handleRestoreField }
            />

            <hr />

            <Button
                variant='danger'
                onClick={ handleCommitSettings }
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
