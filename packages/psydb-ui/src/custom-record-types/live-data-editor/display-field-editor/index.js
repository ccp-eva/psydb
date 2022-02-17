import React, { useState, useEffect } from 'react';

import { Button, Table } from 'react-bootstrap';

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import gatherDisplayFieldData from '@mpieva/psydb-common-lib/src/gather-display-field-data';

import EditDisplayFieldsModal from './edit-display-fields-modal';
import FieldPointerList from '../field-pointer-list';


const DisplayFieldEditor = ({
    target,
    record,
    onSuccessfulUpdate,
}) => {
    var { collection } = record;

    var [ showEditModal, setShowEditModal ] = useState(false);

    var handleShowEditModal = () => {
        setShowEditModal(true);
    }

    var handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var currentDisplayFieldData = (
        target === 'optionlist'
        ? record.state.optionListDisplayFields
        : record.state.tableDisplayFields
    );

    var currentDataPointers = (
        getDisplayFields(record, target)
        .map(it => it.dataPointer)
    );

    return (
        <div>
            <FieldPointerList
                dataPointers={ currentDataPointers }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ handleShowEditModal }>
                Edit
            </Button>
            <EditDisplayFieldsModal
                show={ showEditModal }
                onHide={ handleCloseEditModal }
                target={ target }
                record={ record }
                currentDataPointers={ currentDataPointers }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

const getDisplayFields = (record, target) => {
    switch (target) {
        case 'table':
            return record.state.tableDisplayFields;
        case 'optionlist':
            return record.state.optionListDisplayFields;
        case 'extra-description':
            return record.state.extraDescriptionDisplayFields;
        case 'selection-summary':
            return record.state.selectionSummaryDisplayFields;
        case 'invite-confirm-summary':
            return record.state.inviteConfirmSummaryDisplayFields;
        default:
            throw new Error(`unknown target "${target}"`)
    }
}

export default DisplayFieldEditor;
