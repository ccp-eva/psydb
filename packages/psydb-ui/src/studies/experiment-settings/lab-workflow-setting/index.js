import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import * as Variants from './variants';

const LabWorkflowSetting = (ps) => {
    var { type } = ps;

    var pass = only({ from: ps, keys: [
        'settingRecord',
        'settingRelated',
        'availableSubjectCRTs',
       
        // for wrapper
        'variantRecord', // edit
        'existingSubjectTypes', // edit
        'showButtons', // remove modal
        'onEdit',
        'onRemove'
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

export default LabWorkflowSetting;
