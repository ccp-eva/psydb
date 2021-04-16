import React, { useState, useEffect } from 'react';

import {
    Button,
    Modal
} from 'react-bootstrap';

import { PencilFill } from 'react-bootstrap-icons';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

const RecordPicker = ({
    collection,
    recordType,
    baseConstraints,
    value,
    onChange,
}) => {
    var [ record, setRecord ] = useState();
    var [ showModal, setShowModal ] = useState(false);

    var handleSelect = (record) => {
        setRecord(record);
        onChange(record);
        handleCloseModal();
    }

    var handleShowModal = () => {
        setShowModal(true);
    }

    var handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div>
            {(
                record
                    ? record._recordLabel
                    : 'Keine ausgewählt'
            )}
            <Button
                onClick={ handleShowModal }
            >
                <PencilFill />
            </Button>
            <RecordPickerModal
                show={ showModal }
                onHide={ handleCloseModal }

                collection={ collection }
                recordType={ recordType }
                baseConstraints={ baseConstraints }
                onSelectRecord={ handleSelect }
            />
        </div>
    )
}

const RecordPickerModal = ({
    show,
    onHide,

    collection,
    recordType,
    baseConstraints,
    onSelectRecord,
}) => {
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Auswahlliste</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RecordListContainer
                    collection={ collection }
                    recordType={ recordType }
                    baseConstraints={ baseConstraints }

                    onSelectRecord={ onSelectRecord }

                    enableNew={ false }
                    enableView={ false }
                    enableEdit={ false }
                />
            </Modal.Body>
        </Modal>

    );
}

export default RecordPicker;
