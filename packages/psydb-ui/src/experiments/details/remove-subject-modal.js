import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

import {
    ExactObject,
    DefaultBool,
    FullText,
    SaneString,
    UnparticipationStatus,
} from '@mpieva/psydb-schema-fields';

import {
    BlockFromTesting
} from '@mpieva/psydb-schema-fields-special';

var schema = ExactObject({
    properties: {

        subjectComment: SaneString({ title: 'Kommentar' }),
        unparticipateStatus: UnparticipationStatus({ title: 'Grund' }),
        blockFromTesting: BlockFromTesting({ title: 'Proband sperren' }),
    },
    required: [
        'subjectComment',
        'blockFromTesting'
    ],
})

const RemoveSubjectModal = ({
    show,
    onHide,

    experimentData,
    payloadData,

    onSuccessfulUpdate,
}) => {
    if (!show) {
        return null;
    }
   
    var {
        subjectId,
        subjectType
    } = payloadData;

    var subjectData = experimentData.record.state.subjectData.find(it => (
        it.subjectId === subjectId
    ));

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'experiment/remove-subject',
            payload: {
                experimentId: experimentData.record._id,
                subjectId,
            }
        };

        return agent.send({ message }).then(response => {
            onHide();
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Proband austragen</Modal.Title>
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


export default RemoveSubjectModal;
