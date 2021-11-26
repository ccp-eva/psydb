import React from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import ParticipationForm from './participation-form';

const ParticipationModalBody = (ps) => {
    var {
        subjectId,
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'subject/add-manual-participation',
            payload: {
                ...formData,
                id: subjectId
            }
        };

        return agent.send({ message }).then(demuxed([
            onSuccessfulUpdate,
            onHide
        ]));
    }

    return (
        <>
            <ParticipationForm { ...({
                onSubmit: handleSubmit
            })} />
            {/*<TopicForm
                op='create'
                parentId={ parent._id }
                onSuccessfulUpdate={ demuxed([
                    onSuccessfulUpdate,
                    onHide
                ])}
            />*/}
        </>
    )
}

const ParticipationModal = WithDefaultModal({
    title: 'Teilnahme hinzufügen',
    size: 'lg',

    Body: ParticipationModalBody
});

export default ParticipationModal;
