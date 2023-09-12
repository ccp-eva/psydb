import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

const ParticipationEditModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var {
        _id,
        excludeFromMoreExperimentsInStudy,
        type,
        realType,
        ...participation
    } = modalPayloadData;

    var labProcedureType = realType || type;

    var send = useSend((formData) => ({
        type: 'subject/patch-manual-participation',
        payload: {
            participationId: _id,
            ...formData,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]});

    var enableStudyId = false;
    var enableSubjectId = false;

    var initialValues = {
        labProcedureType,
        excludeFromMoreExperimentsInStudy,
        ...participation
    };

    return (
        <>
            <MainForm.Component
                enableStudyId={ enableStudyId }
                enableSubjectId={ enableSubjectId }

                enableTeamSelect={ false }

                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        </>
    );
}

const ParticipationEditModal = WithDefaultModal({
    title: 'Edit Participation',
    size: 'lg',

    Body: ParticipationEditModalBody
});

export default ParticipationEditModal;
