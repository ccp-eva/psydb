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
        }),
        experiments: agent.fetchOpsTeamExperiments({
            teamId, out: 'count'
        })
    }), []);

    var hasExperiments = false;
    var send = useSend((formData) => ({
        type: 'experimentOperatorTeam/patch',
        payload: { id: teamId, props: (
            hasExperiments
            ? only({ from: formData, paths: [ 'color', 'hidden' ]})
            : formData
        )}
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, ...related } = fetched.team.data;
    hasExperiments = fetched.experiments.data.count > 0;

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
            hasExperiments={ hasExperiments }
        />
    );
}

const EditOpsTeamModal = WithDefaultModal({
    title: 'Team bearbeiten',
    size: 'lg',

    Body: EditOpsTeamModalBody
});

export default EditOpsTeamModal;
