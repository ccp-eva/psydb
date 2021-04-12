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

    var [ showEditModal, setShowEditModal ] = useState(false);

    var handleShowEditModal = () => {
        setShowEditModal(true);
    }

    var handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    var handleSaveChanges = () => {
        // TODO
    }

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableDisplayFieldDataByDataPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var currentDisplayFieldData = (
        target === 'optionlist'
        ? record.state.optionListDisplayFields
        : record.state.tableDisplayFields
    );

    var currentDataPointers = (
        currentDisplayFieldData.map(it => it.dataPointer)
    );

    console.log(availableDisplayFieldDataByDataPointer)
    console.log(currentDataPointers);

    return (
        <div>
            <FieldPointerList
                dataPointers={ currentDataPointers }
                availableDisplayFieldDataByDataPointer={
                    availableDisplayFieldDataByDataPointer
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
                availableDisplayFieldDataByDataPointer={
                    availableDisplayFieldDataByDataPointer
                }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

export default DisplayFieldEditor;
