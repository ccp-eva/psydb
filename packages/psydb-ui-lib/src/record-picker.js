import React, { useState, useEffect } from 'react';

import { Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import RecordListContainer from './record-list-container';

const RecordPicker = ({
    collection,
    recordType,
    constraints,

    idLabelProp = '_id',
    value: record,
    onChange,
    hasErrors,
}) => {
    var [ showModal, setShowModal ] = useState(false);
    // FIXME: im not sure how to best reset the state in case
    // it gets out of sync i could do it manually by checking the
    // record ids and foribly update the state
    var [ cachedRecord, setCachedRecord ] = useState(record);

    var handleSelect = (record) => {
        setCachedRecord(record);
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
        cachedRecord
        ? cachedRecord._recordLabel || cachedRecord[idLabelProp]
        : ''
    )

    var classes = [
        'border pl-3 bg-white',
        hasErrors ? 'border-danger' : '',
        (cachedRecord && !cachedRecord._recordLabel) ? 'text-danger' : '',
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
                    onClick={ handleShowModal }
                />
                <InputGroup.Append>
                    <Button
                        variant={ hasErrors ? 'danger' : 'outline-primary' }
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
            <Modal.Body className='bg-light'>
                <RecordListContainer
                    className='bg-white border-left border-right'
                    bsTableProps={{ hover: true }}
                    collection={ collection }
                    recordType={ recordType }
                    constraints={ constraints }

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
