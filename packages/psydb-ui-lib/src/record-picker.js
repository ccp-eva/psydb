import React, { useState, useEffect } from 'react';

import { Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import RecordListContainer from './record-list-container';

const RecordPicker = ({
    collection,
    recordType,
    constraints,

    value: record,
    onChange,
    hasErrors,
}) => {
    var [ showModal, setShowModal ] = useState(false);

    var handleSelect = (record) => {
        onChange(record);
        handleCloseModal();
    }

    var handleShowModal = () => {
        setShowModal(true);
    }

    var handleCloseModal = () => {
        setShowModal(false);
    }
    
    var displayValue = (
        record
        ? record._recordLabel || record._id
        : ''
    )

    var classes = [
        'border pl-3 bg-white',
        hasErrors ? 'border-danger' : '',
        (record && !record._recordLabel) ? 'text-danger' : '',
    ].join(' ')

    return (
        <div>
            <InputGroup>
                <Form.Control
                    className={ classes }
                    value={ displayValue }
                    placeholder='Bitte Datensatz wählen'
                    plaintext
                    readOnly
                />
                <InputGroup.Append>
                    <Button
                        variant={ hasErrors ? 'danger' : 'primary' }
                        onClick={ handleShowModal }
                    >
                        <PencilFill style={{ marginTop: '-3px' }}/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
            <RecordPickerModal
                show={ showModal }
                onHide={ handleCloseModal }

                collection={ collection }
                recordType={ recordType }
                constraints={ constraints }
                onSelectRecord={ handleSelect }
            />
        </div>
    )
    /*return (
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
        </div>
    )*/
}

const RecordPickerModal = ({
    show,
    onHide,

    collection,
    recordType,
    constraints,
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
                    baseConstraints={ constraints }

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
