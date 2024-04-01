import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import LabWorkflowSettingForm from '../lab-workflow-setting-form';


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

    var { type: variantType } = variantRecord;
    var { _id: settingId, state: { subjectTypeKey }} = settingRecord;
    
    var thisAvailableSubjectCRTs = availableSubjectCRTs.filter({
        $or: [
            { type: subjectTypeKey },
            { type: { $nin: existingSubjectTypes }},
        ]
    });

    var send = useSend((formData, formikProps) => ({
        type: `experiment-variant-setting/${variantType}/patch`,
        payload: {
            id: settingId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <LabWorkflowSettingForm
            { ...send.passthrough }
            type={ variantType }
            settingRecord={ settingRecord }
            settingRelated={ settingRelated }
            availableSubjectCRTs={ thisAvailableSubjectCRTs }
        />
    );
}

const EditSettingModal = WithDefaultModal({
    title: 'Edit Settings',
    size: 'lg',

    Body: EditSettingModalBody
});

export default EditSettingModal;
