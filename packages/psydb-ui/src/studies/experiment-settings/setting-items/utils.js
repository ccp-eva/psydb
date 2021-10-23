import React from 'react';
import { InnerSettingPanel } from '@mpieva/psydb-ui-layout';

export const DefaultSettingWrapper = (ps) => {
    var {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes,
        showButtons = true,
        onEdit,
        onRemove,

        children,
    } = ps;
    
    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    var { label } = relatedCustomRecordTypes.subject[subjectTypeKey].state;

    var actionProps = {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes
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
