import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Forms from '../setting-forms';

const EditSettingModalBody = (ps) => {
    var {
        studyId,
        availableSubjectCRTs,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var {
        variantRecord,
        settingRecord,
        settingRelated,
        existingSubjectTypes,
    } = modalPayloadData;

    var { _id: variantId, type: variantType } = variantRecord;
    var { _id: settingId, state: { subjectTypeKey }} = settingRecord;
    
    var language = useUILanguage();

    availableSubjectCRTs = availableSubjectCRTs.filter({
        $or: [
            { type: subjectTypeKey },
            { type: { $nin: existingSubjectTypes }},
        ]
    });

    var SettingForm = ({
        'inhouse': Forms.InviteSetting,
        'online-video-call': Forms.InviteSetting,

        'away-team': Forms.AwayTeamSetting,
        'online-survey': Forms.OnlineSurveySetting,

        'apestudies-wkprc-default': Forms.ApestudiesWKPRCDefaultSetting,
        'manual-only-participation': Forms.ManualOnlyParticipationSetting,
    })[variantType];

    var send = useSend((formData, formikProps) => ({
        type: `experiment-variant-setting/${variantType}/patch`,
        payload: {
            id: settingId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <SettingForm {...({
            ...send.passthrough,

            studyId,
            variantId,
            settingRecord,
            settingRelated,
            availableSubjectCRTs,
        })} />
    );
}

const EditSettingModal = WithDefaultModal({
    title: 'Edit Settings',
    size: 'lg',

    Body: EditSettingModalBody
});

export default EditSettingModal;
