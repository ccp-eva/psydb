import React from 'react';
import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';
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
        ...downstream
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    var translate = useUITranslation();

    var existingSubjectTypes = (
        settingRecords.map(it => it.state.subjectTypeKey)
    );

    var hasNoSubjectTypesLeft = (
        allowedSubjectTypes.length <= existingSubjectTypes.length
    );

    var panelProps = {
        label: `${translate('Lab Workflow')} ${index + 1} - ${translate(variantsEnum.mapping[variantType])}`,
        addButtonLabel: '+ ' + translate('Settings'),
        showAddButton: !!onAddSetting,
        disableAddButton: hasNoSubjectTypesLeft,
        showRemoveButton: !!onRemove,
        onAdd: () => onAddSetting({ variantRecord, existingSubjectTypes }),
        onRemove: () => onRemove({ index, variantRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <SettingList { ...({
                variantRecord,
                settingRecords,
                existingSubjectTypes,
                ...downstream
            })} />
        </OuterSettingPanel>
    )
}

export default VariantListItem;
