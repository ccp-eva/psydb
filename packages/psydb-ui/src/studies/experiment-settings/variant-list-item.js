import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { OuterSettingPanel } from '@mpieva/psydb-ui-layout';
import SettingList from './setting-list';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        settingRecords,
        allowedSubjectTypes,
        onRemove,
        onAddSetting,
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    var listPass = only({ from: ps, keys: [
        'variantRecord',
        'settingRecords',
        'settingRelated',
        'allowedSubjectTypes',

        'allCustomRecordTypes',
        'customRecordTypes',
        'availableSubjectCRTs',

        'onEditSetting',
        'onRemoveSetting'
    ]});

    var translate = useUITranslation();

    var existingSubjectTypes = (
        settingRecords.map(it => it.state.subjectTypeKey)
    );

    var hasNoSubjectTypesLeft = (
        allowedSubjectTypes.length <= existingSubjectTypes.length
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

    var listBag = {
        ...listPass,
        existingSubjectTypes,
    }

    return (
        <OuterSettingPanel { ...panelBag }>
            <SettingList { ...listBag } />
        </OuterSettingPanel>
    )
}

export default VariantListItem;
