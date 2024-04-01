import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import LabWorkflowSettingForm from '../lab-workflow-setting-form';


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

    var thisAvailableSubjectCRTs = availableSubjectCRTs.filter({
        type: { $nin: existingSubjectTypes }
    });

    var send = useSend((formData, formikProps) => ({
        type: `experiment-variant-setting/${variantType}/create`,
        payload: {
            studyId,
            experimentVariantId: variantId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <LabWorkflowSettingForm
            { ...send.passthrough }
            type={ variantType }
            availableSubjectCRTs={ thisAvailableSubjectCRTs }
        />
    );
}

const NewSettingModal = WithDefaultModal({
    title: 'Add Settings',
    size: 'lg',

    Body: NewSettingModalBody
});

export default NewSettingModal;
