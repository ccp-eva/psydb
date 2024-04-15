import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import LabWorkflowSetting from './lab-workflow-setting';

const SettingList = (ps) => {
    var {
        variantRecord,
        settingRecords,

        onEditSetting,
        onRemoveSetting,
    } = ps;

    var pass = only({ from: ps, keys: [
        'settingRelated',
        'availableSubjectCRTs',
        'existingSubjectTypes',
    ]});

    var { type: variantType } = variantRecord;

    var translate = useUITranslation();
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    var handlers = canWrite ? {
        onEdit: onEditSetting,
        onRemove: onRemoveSetting,
    } : {};

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <b>{ translate('Please add settings for at least one subject type.') }</b>
            </div>
        )
    }

    return (
        <>
            { settingRecords.map((it, ix) => (
                <LabWorkflowSetting
                    type={ variantType }

                    key={ ix }
                    settingRecord={ it }
                    variantRecord={ variantRecord }
                    showButtons={ !!canWrite }
                    { ...pass }
                    { ...handlers }
                />
            ))}
        </>
    )
}

export default SettingList;
