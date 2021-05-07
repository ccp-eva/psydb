import React, { useState, useEffect } from 'react';

import { Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

import HelperSetItemListContainer from './helperSetItem-list-container';

const HelperSetItemPicker = ({
    set,

    value: helperSetItem,
    onChange,
    hasErrors,
}) => {
    var [ showModal, setShowModal ] = useState(false);
    // FIXME: im not sure how to best reset the state in case
    // it gets out of sync i could do it manually by checking the
    // helperSetItem ids and foribly update the state
    var [ cachedHelperSetItem, setCachedHelperSetItem ] = useState(helperSetItem);

    var handleSelect = (helperSetItem) => {
        setCachedHelperSetItem(helperSetItem);
        onChange(helperSetItem);
        handleCloseModal();
    }

    var handleShowModal = () => {
        setShowModal(true);
    }

    var handleCloseModal = () => {
        setShowModal(false);
    }
    
    var displayValue = (
        cachedHelperSetItem
        ? cachedHelperSetItem._helperSetItemLabel || cachedHelperSetItem._id
        : ''
    )

    var classes = [
        'border pl-3 bg-white',
        hasErrors ? 'border-danger' : '',
        (cachedHelperSetItem && !cachedHelperSetItem._helperSetItemLabel) ? 'text-danger' : '',
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
                        variant={ hasErrors ? 'danger' : 'outline-primary' }
                        onClick={ handleShowModal }
                    >
                        <PencilFill style={{ marginTop: '-3px' }}/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
            <HelperSetItemPickerModal
                show={ showModal }
                onHide={ handleCloseModal }

                collection={ collection }
                helperSetItemType={ helperSetItemType }
                constraints={ constraints }
                onSelectHelperSetItem={ handleSelect }
            />
        </div>
    )
    /*return (
        <div>
            {(
                helperSetItem
                    ? helperSetItem._helperSetItemLabel
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

const HelperSetItemPickerModal = ({
    show,
    onHide,

    collection,
    helperSetItemType,
    constraints,
    onSelectHelperSetItem,
}) => {
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Auswahlliste</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <HelperSetItemListContainer
                    set={ set }

                    onSelectHelperSetItem={ onSelectHelperSetItem }

                    enableNew={ false }
                    enableView={ false }
                    enableEdit={ false }
                />
            </Modal.Body>
        </Modal>

    );
}

export default HelperSetItemPicker;
