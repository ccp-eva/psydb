import React from 'react';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { AgeFrameForm } from '../age-frame-form';

const NewAgeFrameModalBody = (ps) => {
    var {
        studyId,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { selectorRecord, subjectCRT } = modalPayloadData;
    var { _id: selectorId, subjectTypeKey } = selectorRecord;

    var send = useSend((formData, formikProps) => ({
        type: `ageFrame/create`,
        payload: {
            subjectTypeKey,
            studyId,
            subjectSelectorId: selectorId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <AgeFrameForm {...({
            ...send.passthrough,
            subjectCRT,
            onHide,
        })} />
    );
}

const NewAgeFrameModal = WithDefaultModal({
    title: 'Add Age Range',
    size: 'lg',

    Body: NewAgeFrameModalBody
});

export default NewAgeFrameModal;
