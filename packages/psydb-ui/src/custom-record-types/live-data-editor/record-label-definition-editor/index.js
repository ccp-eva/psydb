import React from 'react';

import { keyBy } from '@mpieva/psydb-core-utils';
import { gatherDisplayFieldData } from '@mpieva/psydb-common-lib';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, Table } from '@mpieva/psydb-ui-layout';

import EditDefinitionModal from './edit-definition-modal';
import FieldPointerList from '../field-pointer-list';


const RecordLabelDefinitionEditor = (ps) => {
    var {
        record,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var modal = useModalReducer();

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record,
        applyGeneralFlags: true,
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
                    { translate('Format') }
                    {': '}
                    { format || translate('Not Set') }
                </b>
            </p>
            <FieldPointerList
                dataPointers={ tokens.map(it => it.dataPointer) }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ modal.handleShow }>
                { translate('Edit') }
            </Button>
            <EditDefinitionModal
                { ...modal.passthrough }

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
