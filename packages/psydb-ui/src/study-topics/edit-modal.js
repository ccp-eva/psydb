import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { TopicForm } from './form';

const EditTopicModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { id } = modalPayloadData;
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecord({
            collection: 'studyTopic',
            id,
        })
    ), [ id ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record } = fetched.data;

    return (
        <>
            <TopicForm
                op='patch'
                record={ record }
                onSuccessfulUpdate={ demuxed([
                    onSuccessfulUpdate,
                    onHide
                ])}
            />
        </>
    )
}

const EditTopicModal = WithDefaultModal({
    title: 'Themengebiet bearbeiten',
    size: 'md',

    Body: EditTopicModalBody
});

export default EditTopicModal;
