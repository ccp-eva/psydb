import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Forms from '../setting-forms';

const EditSettingModalBody = (ps) => {
    var {
        studyId,
        allowedSubjectTypes,
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
    var { subjectTypeKey } = settingRecord.state;
    
    var language = useUILanguage();

    availableSubjectCRTs = availableSubjectCRTs.filter({
        $or: [
            { type: subjectTypeKey },
            { type: { $nin: existingSubjectTypes }},
        ]
    });

    // FIXME: compat
    var allowedSubjectTypes = availableSubjectCRTs.asOptions({ language });

    var SettingForm = ({
        'inhouse': Forms.InhouseSetting,
        'away-team': Forms.AwayTeamSetting,
        'online-video-call': Forms.OnlineVideoCallSetting,
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
            allowedSubjectTypes,
        })} />
    );
}

const EditSettingModal = WithDefaultModal({
    title: 'Edit Settings',
    size: 'lg',

    Body: EditSettingModalBody
});

export default EditSettingModal;
