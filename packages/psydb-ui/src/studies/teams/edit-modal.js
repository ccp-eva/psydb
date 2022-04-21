import React from 'react';
import { only } from '@mpieva/psydb-core-utils';

import {
    WithDefaultModal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { useSend, useFetchAll } from '@mpieva/psydb-ui-hooks';
import MainForm from './main-form';

const EditOpsTeamModalBody = (ps) => {
    var { studyId, modalPayloadData, onHide, onSuccessfulUpdate } = ps;
    var teamId = modalPayloadData;

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        team: agent.readRecord({
            collection: 'experimentOperatorTeam',
            id: teamId
        })
    }), []);

    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/patch',
        payload: { id: teamId, props: formData }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, ...related } = fetched.team.data;

    var initialValues = only({
        from: record.state,
        paths: [
            'color',
            'personnelIds',
            'hidden'
        ], 
    });
    
    return (
        <MainForm.Component
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    );
}

const EditOpsTeamModal = WithDefaultModal({
    title: 'Neues Team',
    size: 'lg',

    Body: EditOpsTeamModalBody
});

export default EditOpsTeamModal;
