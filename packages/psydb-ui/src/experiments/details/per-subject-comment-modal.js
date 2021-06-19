import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

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
            type: 'experiment/change-per-subject-comment',
            payload: {
                experimentId: experimentData.record._id,
                subjectId,
                ...formData,
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
            size='xl'
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


export default PerSubjectCommentModal;
