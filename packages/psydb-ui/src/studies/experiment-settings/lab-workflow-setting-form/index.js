import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import * as Variants from './variants';

const LabWorkflowSettingForm = (ps) => {
    var { type } = ps;

    var pass = only({ from: ps, keys: [
        'settingRecord',
        'settingRelated',
        'availableSubjectCRTs',
        
        'isTransmitting',
        'onSubmit',
        'onHide',
    ]});

    var Component = ({
        'inhouse': Variants.InviteSetting,
        'online-video-call': Variants.InviteSetting,
        'away-team': Variants.AwayTeamSetting,
        'online-survey': Variants.OnlineSurveySetting,
        
        'apestudies-wkprc-default': Variants.ApestudiesWKPRCDefaultSetting,
        'manual-only-participation': Variants.ManualOnlyParticipationSetting,
    })[type];

    return (
        <Component { ...pass } />
    )
}

export default LabWorkflowSettingForm;
