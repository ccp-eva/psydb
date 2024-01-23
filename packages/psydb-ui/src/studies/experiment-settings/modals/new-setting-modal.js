import React from 'react';
import omit from '@cdxoo/omit';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Forms from '../setting-forms';

const NewSettingModalBody = (ps) => {
    var {
        studyId,
        allowedSubjectTypes,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { variantRecord, existingSubjectTypes } = modalPayloadData;
    var { _id: variantId, type: variantType } = variantRecord;

    allowedSubjectTypes = omit(existingSubjectTypes, allowedSubjectTypes)

    var SettingForm = ({
        'inhouse': Forms.InhouseSetting,
        'away-team': Forms.AwayTeamSetting,
        'online-video-call': Forms.OnlineVideoCallSetting,
        'online-survey': Forms.OnlineSurveySetting,
        'apestudies-wkprc-default': Forms.ApestudiesWPKRCDefaultSetting,
        'manual-only-participation': Forms.ManualOnlyParticipationSetting,
    })[variantType];

    return (
        <SettingForm {...({
            op: 'create',
            studyId,
            variantId,
            allowedSubjectTypes,
            onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
        })} />
    );
}

const NewSettingModal = WithDefaultModal({
    title: 'Add Settings',
    size: 'lg',

    Body: NewSettingModalBody
});

export default NewSettingModal;
