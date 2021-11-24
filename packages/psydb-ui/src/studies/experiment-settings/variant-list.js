import React from 'react';
import groupBy from '@mpieva/psydb-common-lib/src/group-by';
import { SimpleList } from '@mpieva/psydb-ui-layout';
import VariantListItem from './variant-list-item';

const VariantList = (ps) => {
    var {
        variantRecords,
        settingRecords,
        onAddVariant,
        onRemoveVariant,
        ...downstream
    } = ps;

    var groupedSettings = groupBy({
        items: settingRecords,
        byProp: 'experimentVariantId'
    });

    return (
        <SimpleList { ...({
            items: variantRecords,
            emptyLabel:'Keine Ablauf-Einstellungen vorhanden',
            addButtonLabel: '+ Ablauf',
            showAddButton: !!onAddVariant,
            onAdd: onAddVariant,
        }) }>
            {(it, index) => (
                <VariantListItem key={ index } {...({
                    index,
                    variantRecord: it,
                    settingRecords: groupedSettings[it._id] || [],
                    showRemoveButton: !!onRemoveVariant,
                    onRemove: onRemoveVariant,
                    ...downstream,
                })} />
            )}
        </SimpleList>
    )
}

export default VariantList;
