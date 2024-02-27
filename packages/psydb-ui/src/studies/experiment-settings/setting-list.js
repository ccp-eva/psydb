import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    InhouseSetting,
    AwayTeamSetting,
    OnlineVideoCallSetting,
    OnlineSurveySetting,
    ApestudiesWKPRCDefaultSetting,
    ManualOnlyParticipationSetting,
} from './setting-items';

const SettingList = (ps) => {
    var {
        variantRecord,
        settingRecords,
       
        allowedSubjectTypes,
        existingSubjectTypes,

        onEditSetting,
        onRemoveSetting,
        ...downstream
    } = ps;

    var { type: variantType } = variantRecord;

    var translate = useUITranslation();
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <b>{ translate('Please add settings for at least one subject type.') }</b>
            </div>
        )
    }

    var SettingComponent = ({
        'inhouse': InhouseSetting,
        'away-team': AwayTeamSetting,
        'online-video-call': OnlineVideoCallSetting,
        'online-survey': OnlineSurveySetting,
        
        'apestudies-wkprc-default': ApestudiesWKPRCDefaultSetting,
        'manual-only-participation': ManualOnlyParticipationSetting,
    })[variantType];

    return (
        <>
            { settingRecords.map((settingRecord, index) => (
                <SettingComponent key={ index } { ...({
                    variantRecord,
                    settingRecord,
                    existingSubjectTypes,
                    showButtons: !!canWrite,
                    ...(canWrite && {
                        onEdit: onEditSetting,
                        onRemove: onRemoveSetting,
                    }),
                    ...downstream
                })} />
            ))}
        </>
    )
}

export default SettingList;
