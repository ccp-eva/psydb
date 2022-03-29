import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { gatherDisplayFieldData } from '@mpieva/psydb-common-lib';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import FieldPointerList from '../field-pointer-list';
import EditFormOrderModal from './edit-form-order-modal';

const FormOrderEditor = (ps) => {
    var {
        record,
        onSuccessfulUpdate
    } = ps;

    var { collection, state } = record;
    var { formOrder } = state;

    var editModal = useModalReducer();

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer' // FIXME
    });

    var formOrderPointers = formOrder.map(it => it.dataPointer);

    return (
        <div>
            <FieldPointerList
                dataPointers={ formOrderPointers }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ editModal.handleShow }>
                Edit
            </Button>
            
            <EditFormOrderModal
                { ...editModal.passthrough }
                recordId={ record._id }
                currentDataPointers={ formOrderPointers }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

export default FormOrderEditor;
