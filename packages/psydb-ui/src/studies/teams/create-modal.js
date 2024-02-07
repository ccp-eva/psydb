import React from 'react';

import { useSend, useReadRecord } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, LoadingIndicator } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

const CreateOpsTeamModalBody = (ps) => {
    var { studyId, onHide, onSuccessfulUpdate } = ps;

    var [ didFetch, fetched ] = useReadRecord({
        collection: 'study',
        id: studyId,
        shouldFetchSchema: false,
        shouldFetchCRTSettings: false
    });

    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/create',
        payload: { studyId, props: formData }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record: studyRecord } = fetched;

    var initialValues = MainForm.createDefaults({
        researchGroupIds: studyRecord.state.researchGroupIds
    });

    return (
        <MainForm.Component
            initialValues={ initialValues }
            studyRecord={ studyRecord }
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
