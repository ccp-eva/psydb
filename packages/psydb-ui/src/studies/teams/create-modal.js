import React from 'react';

import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { useSend } from '@mpieva/psydb-ui-hooks';
import MainForm from './main-form';

const CreateOpsTeamModalBody = (ps) => {
    var { studyId, onHide, onSuccessfulUpdate } = ps;

    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/create',
        payload: { studyId, props: formData }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    var initialValues = MainForm.createDefaults();

    return (
        <MainForm.Component
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    )
}

const CreateOpsTeamModal = WithDefaultModal({
    title: 'New Team',
    size: 'lg',

    Body: CreateOpsTeamModalBody
});

export default CreateOpsTeamModal;
