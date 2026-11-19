import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { InnerSettingPanel } from '@mpieva/psydb-ui-layout';

export const DefaultSettingWrapper = (ps) => {
    var {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes,
        existingSubjectTypes,
        showButtons = true,
        onEdit,
        onRemove,

        children,
    } = ps;
    
    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    
    var [{ translate }] = useI18N();
    var label = translate.crt(
        relatedCustomRecordTypes.subject[subjectTypeKey]
    );

    var actionProps = {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes,
        existingSubjectTypes,
    };

    var panelProps = {
        label,
        onEdit: () => onEdit(actionProps),
        onRemove: () => onRemove(actionProps),
        showEditButton: showButtons,
        showRemoveButton: showButtons,
    }

    return (
        <InnerSettingPanel { ...panelProps }>
            { children }
        </InnerSettingPanel>
    )
}
