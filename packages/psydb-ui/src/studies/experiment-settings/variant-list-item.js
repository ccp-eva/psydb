import React from 'react';
import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';
import { OuterSettingPanel } from '@mpieva/psydb-ui-layout';
import SettingList from './setting-list';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        onRemove,
        onAddSetting,
        ...downstream
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    var panelProps = {
        label: `Ablauf ${index + 1} - ${variantsEnum.mapping[variantType]}`,
        addButtonLabel: '+ Einstellungen',
        showAddButton: !!onAddSetting,
        showRemoveButton: !!onRemove,
        onAdd: () => onAddSetting({ variantRecord }),
        onRemove: () => onRemove({ index, variantRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <SettingList { ...({
                variantRecord,
                ...downstream
            })} />
        </OuterSettingPanel>
    )
}

export default VariantListItem;
