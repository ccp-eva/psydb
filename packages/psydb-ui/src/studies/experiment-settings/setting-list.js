import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import * as Variants from './setting-items';

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
        'inhouse': Variants.InviteSetting,
        'online-video-call': Variants.InviteSetting,
        'away-team': Variants.AwayTeamSetting,
        'online-survey': Variants.OnlineSurveySetting,
        
        'apestudies-wkprc-default': Variants.ApestudiesWKPRCDefaultSetting,
        'manual-only-participation': Variants.ManualOnlyParticipationSetting,
    })[variantType];

    var componentPass = only({ from: ps, keys: [
        'variantRecord',
        'settingRelated',

        'allowedSubjectTypes',
        'existingSubjectTypes',
        
        'allCustomRecordTypes',
        'customRecordTypes',
        'availableSubjectCRTs',
    ]});

    var handlers = canWrite ? {
        onEdit: onEditSetting,
        onRemove: onRemoveSetting,
    } : {};

    return (
        <>
            { settingRecords.map((it, ix) => (
                <SettingComponent
                    key={ ix }
                    settingRecord={ it }
                    showButtons={ !!canWrite }
                    { ...componentPass }
                    { ...handlers }
                />
            ))}
        </>
    )
}

export default SettingList;
