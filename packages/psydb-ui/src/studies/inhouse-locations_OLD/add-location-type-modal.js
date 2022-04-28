import React, { useEffect, useReducer } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';
import { Modal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

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
                collection: 'location',
                constraints: {
                    //'/key': { $nin: existingSubjectTypeKeys }
                },
                minLength: 1,
            })
        },
        required: [
            'customRecordType',
        ]
    };

    return schema;
};


const AddLocationTypeModal = ({
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
            type: 'study/add-inhouse-test-location-type',
            payload: {
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

export default AddLocationTypeModal;
