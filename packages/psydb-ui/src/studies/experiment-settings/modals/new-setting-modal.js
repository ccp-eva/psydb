import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Forms from '../setting-forms';

const NewSettingModalBody = (ps) => {
    var {
        studyId,
        availableSubjectCRTs,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { variantRecord, existingSubjectTypes } = modalPayloadData;
    var { _id: variantId, type: variantType } = variantRecord;

    var language = useUILanguage();

    availableSubjectCRTs = availableSubjectCRTs.filter({
        type: { $nin: existingSubjectTypes }
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
        type: `experiment-variant-setting/${variantType}/create`,
        payload: {
            studyId,
            experimentVariantId: variantId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <SettingForm {...({
            ...send.passthrough,
            studyId,
            variantId,
            availableSubjectCRTs,
        })} />
    );
}

const NewSettingModal = WithDefaultModal({
    title: 'Add Settings',
    size: 'lg',

    Body: NewSettingModalBody
});

export default NewSettingModal;
