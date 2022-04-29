import React from 'react';
import omit from '@cdxoo/omit';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Forms from '../setting-forms';

const EditSettingModalBody = (ps) => {
    var {
        studyId,
        allowedSubjectTypes,
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

    allowedSubjectTypes = {
        ...omit(existingSubjectTypes, allowedSubjectTypes),
        [subjectTypeKey]: (
            settingRelated.relatedCustomRecordTypes.subject[subjectTypeKey]
            .state.label
        )
    }

    var SettingForm = ({
        'inhouse': Forms.InhouseSetting,
        'away-team': Forms.AwayTeamSetting,
        'online-video-call': Forms.OnlineVideoCallSetting,
        'online-survey': Forms.OnlineSurveySetting
    })[variantType];

    return (
        <SettingForm {...({
            op: 'patch',
            studyId,
            variantId,
            settingRecord,
            settingRelated,
            allowedSubjectTypes,
            onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
        })} />
    );
}

const EditSettingModal = WithDefaultModal({
    title: 'Einstellungen bearbeiten',
    size: 'lg',

    Body: EditSettingModalBody
});

export default EditSettingModal;
