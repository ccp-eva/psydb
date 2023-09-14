import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { gatherDisplayFieldData } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();
    var editModal = useModalReducer();

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer' // FIXME
    });

    return (
        <div>
            <FieldPointerList
                dataPointers={ formOrder }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ editModal.handleShow }>
                { translate('Edit') }
            </Button>
            
            <EditFormOrderModal
                { ...editModal.passthrough }
                recordId={ record._id }
                currentDataPointers={ formOrder }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

export default FormOrderEditor;
