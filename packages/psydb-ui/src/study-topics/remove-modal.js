import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { RecordRemover } from './record-remover';

const RemoveTopicModalBody = (ps) => {
    var {
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { id } = modalPayloadData;

    return (
        <RecordRemover
            collection='studyTopic'
            id={ id }
            onHide={ onHide }
            onSuccessfulUpdate={ onSuccessfulUpdate }
        />
    )
}

const RemoveTopicModal = WithDefaultModal({
    title: 'Delete Study Topic',
    size: 'md',

    Body: RemoveTopicModalBody
});

export default RemoveTopicModal;
