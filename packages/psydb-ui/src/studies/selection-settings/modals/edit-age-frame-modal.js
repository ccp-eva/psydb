import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
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
        selectorRecord,
        ageFrameRecord,
        ageFrameRelated
    } = modalPayloadData;

    var { _id: selectorId, subjectTypeKey } = selectorRecord;

    return (
        <div>
            <AgeFrameForm {...({
                op: 'patch',
                studyId,
                selectorId,
                subjectTypeKey,

                ageFrameRecord,
                ageFrameRelated,

                onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
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
