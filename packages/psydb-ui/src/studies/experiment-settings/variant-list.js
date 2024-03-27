import React from 'react';
import { groupBy, only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SimpleList } from '@mpieva/psydb-ui-layout';
import VariantListItem from './variant-list-item';

const VariantList = (ps) => {
    var {
        variantRecords,
        settingRecords,
        disableAddLabOps,

        onAddVariant,
        onRemoveVariant,
    } = ps;

    var pass = only({ from: ps, keys: [
        'allCustomRecordTypes',
        'customRecordTypes',
        'availableSubjectCRTs',

        'settingRelated',
        'allowedSubjectTypes',

        'onAddSetting',
        'onEditSetting',
        'onRemoveSetting',
    ]})

    var translate = useUITranslation();

    var groupedSettings = groupBy({
        items: settingRecords,
        byProp: 'experimentVariantId'
    });

    return (
        <SimpleList { ...({
            items: variantRecords,
            emptyLabel: translate('Please add at least one lab workflow.'),
            addButtonLabel: '+ ' + translate('Lab Workflow'),
            showAddButton: !!onAddVariant,
            disableAddButton: disableAddLabOps,
            onAdd: onAddVariant,
        }) }>
            {(it, index) => (
                <VariantListItem key={ index } {...({
                    index,
                    variantRecord: it,
                    settingRecords: groupedSettings[it._id] || [],
                    showRemoveButton: !!onRemoveVariant,
                    onRemove: onRemoveVariant,
                    ...pass,
                })} />
            )}
        </SimpleList>
    )
}

export default VariantList;
