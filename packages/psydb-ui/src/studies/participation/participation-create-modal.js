import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import ParticipationCreateForm from './participation-create-form';

const ParticipationCreateModalBody = (ps) => {
    var {
        studyId,
        subjectRecordType,
        onHide,
        onSuccessfulCreate
    } = ps;

    var send = useSend(({ formData }) => ({
        type: 'subject/add-manual-participation',
        payload: {
            ...formData,
            studyId
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulCreate ]});


    return (
        <div>
            <ParticipationCreateForm { ...({
                subjectRecordType,
                onSubmit: send.exec
            })} />
        </div>
    );
}

const ParticipationCreateModal = WithDefaultModal({
    title: 'Probanden hinzufügen',
    size: 'lg',

    Body: ParticipationCreateModalBody
});

export default ParticipationCreateModal;
