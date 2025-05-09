import React from 'react';

import { keyBy } from '@mpieva/psydb-core-utils';
import { gatherDisplayFieldData } from '@mpieva/psydb-common-lib';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, Table } from '@mpieva/psydb-ui-layout';

import EditDisplayFieldsModal from './edit-display-fields-modal';
import FieldPointerList from '../field-pointer-list';


const DisplayFieldEditor = (ps) => {
    var {
        target,
        record,
        onSuccessfulUpdate,
    } = ps;

    var { collection } = record;

    var translate = useUITranslation();
    var modal = useModalReducer();

    var availableDisplayFieldData = gatherDisplayFieldData({
        customRecordTypeData: record, applyGeneralFlags: true,
    });

    var availableFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var currentDataPointers = (
        (getDisplayFields(record, target) || [])
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
            <Button onClick={ modal.handleShow }>
                { translate('Edit') }
            </Button>
            <EditDisplayFieldsModal
                { ...modal.passthrough }

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
        case 'invite-selection-list':
            return record.state.selectionRowDisplayFields;
        case 'away-team-selection-list':
            return record.state.awayTeamSelectionRowDisplayFields;
        default:
            throw new Error(`unknown target "${target}"`)
    }
}

export default DisplayFieldEditor;
