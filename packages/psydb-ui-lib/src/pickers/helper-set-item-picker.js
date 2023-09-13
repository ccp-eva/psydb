import React, { useState, useEffect } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    Form,
    InputGroup,
    Button,
    Modal,
    Icons
} from '@mpieva/psydb-ui-layout';

import HelperSetItemListContainer from '../../helperSetItem-list-container';
import { usePickerHandling } from './use-picker-handling';

const HelperSetItemPicker = (ps) => {
    var {
        set,

        value: helperSetItem,
        onChange,
        hasErrors,
    } = ps;

    var translate = useUITranslation();

    var {
        modal, cached, onEdit, onSelect, onClear
    } = usePickerHandling({ record: helperSetItem, onChange });

    var displayValue = (
        cached
        ? cached._helperSetItemLabel || cached._id
        : ''
    );

    var classes = [
        'border pl-3 bg-white',
        hasErrors ? 'border-danger' : '',
        (cached && !cached._helperSetItemLabel) ? 'text-danger' : '',
    ].join(' ')

    return (
        <div>
            <InputGroup>
                <Form.Control
                    className={ classes }
                    value={ displayValue }
                    placeholder={ translate('Please Select Record') }
                    plaintext
                    readOnly
                />
                <InputGroup.Append>
                    <Button
                        variant={ hasErrors ? 'danger' : 'outline-primary' }
                        onClick={ handleShowModal }
                    >
                        <Icons.PencilFill style={{ marginTop: '-3px' }}/>
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
