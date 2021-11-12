import React from 'react';

import {
    ExactObject,
    ExperimentVariantEnum
} from '@mpieva/psydb-schema-fields';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';
import * as Forms from '../setting-forms';

const schema = ExactObject({
    properties: {
        type: ExperimentVariantEnum(),
    },
    required: [ 'type' ]
});

const NewSettingModalBody = (ps) => {
    var {
        studyId,
        allowedSubjectTypes,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { variantRecord } = modalPayloadData;
    var { _id: variantId, type: variantType } = variantRecord;

    var SettingForm = ({
        'inhouse': Forms.InhouseSetting,
        'away-team': Forms.AwayTeamSetting,
        'online-video-call': Forms.OnlineVideoCallSetting,
        'online-survey': Forms.OnlineSurveySetting
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
    title: 'Einstellungen hinzufügen',
    size: 'lg',

    Body: NewSettingModalBody
});

export default NewSettingModal;
