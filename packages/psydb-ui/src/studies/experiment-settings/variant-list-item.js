import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { OuterSettingPanel } from '@mpieva/psydb-ui-layout';
import SettingList from './setting-list';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        settingRecords,
        availableSubjectCRTs,
        onRemove,
        onAddSetting,
    } = ps;

    var pass = {}
    pass.list = only({ from: ps, keys: [
        'variantRecord',
        'settingRecords',
        'settingRelated',
        'availableSubjectCRTs',

        'onEditSetting',
        'onRemoveSetting'
    ]});

    var { type: variantType, state: variantState } = variantRecord;

    var translate = useUITranslation();

    var existingSubjectTypes = (
        settingRecords.map(it => it.state.subjectTypeKey)
    );

    var hasNoSubjectTypesLeft = (
        availableSubjectCRTs.items().length <= existingSubjectTypes.length
    );

    var panelBag = {
        label: `${translate('Lab Workflow')} ${index + 1} - ${translate(enums.labMethods.mapping[variantType])}`,
        addButtonLabel: '+ ' + translate('Settings'),
        showAddButton: !!onAddSetting,
        disableAddButton: hasNoSubjectTypesLeft,
        showRemoveButton: !!onRemove,
        onAdd: () => onAddSetting({ variantRecord, existingSubjectTypes }),
        onRemove: () => onRemove({ index, variantRecord })
    };

    return (
        <OuterSettingPanel { ...panelBag }>
            <SettingList
                { ...pass.list }
                existingSubjectTypes={ existingSubjectTypes }
            />
        </OuterSettingPanel>
    )
}

export default VariantListItem;
