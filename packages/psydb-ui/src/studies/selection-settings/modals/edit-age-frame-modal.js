import React from 'react';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { AgeFrameForm } from '../age-frame-form';

const EditAgeFrameModalBody = (ps) => {
    var {
        studyId,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var {
        //selectorRecord,
        ageFrameRecord,
        ageFrameRelated,
        subjectCRT,
    } = modalPayloadData;

    var { _id: ageFrameId } = ageFrameRecord; 

    var send = useSend((formData, formikProps) => ({
        type: `ageFrame/patch`,
        payload: {
            id: ageFrameId,
            props: formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <div>
            <AgeFrameForm {...({
                ...send.passthrough,

                ageFrameRecord,
                ageFrameRelated,
                subjectCRT,
                onHide,
            })} />
        </div>
    );
}

const EditAgeFrameModal = WithDefaultModal({
    title: 'Edit Age Range',
    size: 'lg',

    Body: EditAgeFrameModalBody
});

export default EditAgeFrameModal;
