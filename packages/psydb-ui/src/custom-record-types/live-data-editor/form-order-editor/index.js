import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { Button, Table } from '@mpieva/psydb-ui-layout';
import { gatherDisplayFieldData } from '@mpieva/psydb-common-lib';

import FieldPointerList from '../field-pointer-list';

const FormOrderEditor = (ps) => {
    var {
        record,
        onSuccessfulUpdate
    } = ps;

    var { collection, formOrder } = record;

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'pointer'
    });

    var allPointers = Object.keys(availableFieldDataByPointer);

    return (
        <div>
            <FieldPointerList
                dataPointers={ formOrder || allPointers }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
        </div>
    );
}

export default FormOrderEditor;
