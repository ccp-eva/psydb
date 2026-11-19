import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import { Modal, Button } from 'react-bootstrap';
import EditDisplayFieldsForm from './edit-display-fields-form';

const EditDisplayFieldsModal = ({
    show,
    onHide,
    record,
    target,
    currentDataPointers,
    availableFieldDataByPointer,
    onSuccessfulUpdate,
}) => {
    target = target || 'table';
    
    var [{ translate }] = useI18N();

    var handleSuccess = () => {
        onSuccessfulUpdate();
        onHide()
    }
    return (
        <Modal
            show={ show }
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {
                        target === 'optionlist'
                        ? translate('Columns (Option Select)')
                        : translate('Columns')
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <EditDisplayFieldsForm
                    target={ target }
                    record={ record }
                    currentDataPointers={ currentDataPointers }
                    availableFieldDataByPointer={
                        availableFieldDataByPointer
                    }
                    onSuccess={ handleSuccess }
                />
            </Modal.Body>
        </Modal>
    );
}

export default EditDisplayFieldsModal;
