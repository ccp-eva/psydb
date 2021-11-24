import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { TopicForm } from './form';

const CreateTopicModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { parent } = modalPayloadData;

    return (
        <>
            <TopicForm
                op='create'
                parentId={ parent._id }
                onSuccessfulUpdate={ demuxed([
                    onSuccessfulUpdate,
                    onHide
                ])}
            />
        </>
    )
}

const CreateTopicModal = WithDefaultModal({
    title: 'Neues Themengebiet',
    size: 'md',

    Body: CreateTopicModalBody
});

export default CreateTopicModal;
