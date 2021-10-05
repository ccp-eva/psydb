import React from 'react';
import { Modal, Button } from '@mpieva/psydb-ui-layout';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';
import { SchemaForm } from '../schema-form';

import {
    ExactObject,
    DefaultBool,
    FullText,
    SaneString,
} from '@mpieva/psydb-schema-fields';

var schema = ExactObject({
    properties: {
        comment: SaneString({ title: 'Kommentar' })
    },
    required: [ 'comment' ],
})

const PerSubjectCommentModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    payloadData,

    onSuccessfulUpdate,
}) => {

    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;

    var {
        subjectId,
        subjectType
    } = payloadData;

    var subjectData = experimentData.record.state.subjectData.find(it => (
        it.subjectId === subjectId
    ));

    var handleSubmit = createSend(({ formData }) => ({
        type: 'experiment/change-per-subject-comment',
        payload: {
            experimentId: experimentData.record._id,
            subjectId,
            ...formData,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <Modal
            show={ show }
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Termin-Kommentar</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <SchemaForm
                    schema={ schema }
                    formData={{
                        comment: subjectData.comment,
                    }}
                    onSubmit={ handleSubmit }
                />
            </Modal.Body>
        </Modal>
    )
}

const PerSubjectCommentModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <PerSubjectCommentModal { ...ps } />
    );
}



export default PerSubjectCommentModalWrapper;
