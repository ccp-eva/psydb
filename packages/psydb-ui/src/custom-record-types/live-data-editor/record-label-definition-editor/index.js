import React, { useState, useEffect } from 'react';

import { Button, Table } from 'react-bootstrap';

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import gatherDisplayFieldData from '@mpieva/psydb-common-lib/src/gather-display-field-data';

import EditDefinitionModal from './edit-definition-modal';
import FieldPointerList from '../field-pointer-list';


const RecordLabelDefinitionEditor = ({
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

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var {
        format,
        tokens
    } = record.state.recordLabelDefinition;

    return (
        <div>
            <p>
                <b>
                    Format:{' '}
                    {(
                        format
                        ? format
                        : 'Nicht festgelegt'
                    )}
                </b>
            </p>
            <FieldPointerList
                dataPointers={ tokens.map(it => it.dataPointer) }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ handleShowEditModal }>
                Edit
            </Button>
            <EditDefinitionModal
                show={ showEditModal }
                onHide={ handleCloseEditModal }
                record={ record }
                format={ format }
                tokens={ tokens }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

export default RecordLabelDefinitionEditor;
