import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

import ParticipationCreateForm from './participation-create-form';

const ParticipationCreateModalBody = (ps) => {
    var {
        studyId,
        subjectRecordType,
        onHide,
        onSuccessfulCreate
    } = ps;

    var send = useSend((formData) => ({
        type: 'subject/add-manual-participation',
        payload: {
            ...formData,
            studyId
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulCreate ]});

    var initialValues = MainForm.createDefaults();

    return (
        <>
            <MainForm.Component
                subjectType={ subjectRecordType }
                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        </>
    );
}

const ParticipationCreateModal = WithDefaultModal({
    title: 'Probanden hinzufügen',
    size: 'lg',

    Body: ParticipationCreateModalBody
});

export default ParticipationCreateModal;
