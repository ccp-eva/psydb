import React, { useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

import {
    ExactObject,
    CustomRecordTypeKey,
    DefaultBool,
} from '@mpieva/psydb-schema-fields'

const createSchema = ({ existingSubjectTypeKeys }) => {
    var schema = {
        type: 'object',
        properties: {
            customRecordType: CustomRecordTypeKey({
                title: 'Typ',
                collection: 'subject',
                constraints: {
                    //'/key': { $nin: existingSubjectTypeKeys }
                }
            })
        }
    };

    return schema;
};


const AddSubjectTypeModal = ({
    type,
    show,
    onHide,

    existingSubjectTypeKeys,

    studyRecord,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    onSuccessfulUpdate,
}) => {

    var schema = createSchema({ existingSubjectTypeKeys });

    var handleSubmit = ({ formData }) => {

        var message = {
            payload: {
            type: 'study/add-subject-type',
                id: studyRecord._id,
                lastKnownEventId: studyRecord._lastKnownEventId,
                ...formData
            }
        };

        return agent.send({ message }).then(response => {
            onHide();
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Probandentyp Hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <SchemaForm
                        schema={ schema }
                        formContext={{
                            //relatedRecordLabels,
                            //relatedHelperSetItems,
                            //relatedCustomRecordTypeLabels,
                        }}
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddSubjectTypeModal;
