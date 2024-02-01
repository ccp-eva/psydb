import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import ExperimentCreateForm from './experiment-create-form';

const ParticipationCreateModalBody = (ps) => {
    var {
        studyId,
        onHide,
        onSuccessfulUpdate
    } = ps;

    return (
        <>
            <ExperimentCreateForm
                studyId={ studyId }
                enableTeamSelect={ true }
                
                onSuccessfulUpdate={ demuxed([
                    onHide,
                    onSuccessfulUpdate
                ])}
            />
        </>
    );
}

const ParticipationCreateModal = WithDefaultModal({
    Body: ParticipationCreateModalBody,
    title: 'Add Participation',
    size: 'xl',
});

export default ParticipationCreateModal;
