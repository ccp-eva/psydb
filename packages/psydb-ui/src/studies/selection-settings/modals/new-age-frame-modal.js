import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { AgeFrameForm } from '../age-frame-form';

const NewAgeFrameModalBody = (ps) => {
    var {
        studyId,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { selectorRecord } = modalPayloadData;
    var { _id: selectorId, subjectTypeKey } = selectorRecord;

    return (
        <AgeFrameForm {...({
            op: 'create',
            studyId,
            selectorId,
            subjectTypeKey,
            onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
        })} />
    );
}

const NewAgeFrameModal = WithDefaultModal({
    title: 'Add Age Range',
    size: 'lg',

    Body: NewAgeFrameModalBody
});

export default NewAgeFrameModal;
