import React, { useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';
import { SchemaForm } from '@mpieva/psydb-ui-schema-form';

const GeneralSubjectTypeSettingsModal = ({
    show,
    onHide,

    schema,
    externalLocationGrouping,
    enableOnlineTesting,
    subjectsPerExperiment,
    subjectRecordType,
    studyRecord,

    onSuccessfulUpdate,
}) => {

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'study/update-subject-type-base-settings',
            payload: {
                id: studyRecord._id,
                lastKnownEventId: studyRecord._lastKnownEventId,
                customRecordType: subjectRecordType,
                ...formData,
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
                <Modal.Title>Generelle Typ-Einstellungen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <SchemaForm
                        schema={ schema }
                        formData={{
                            externalLocationGrouping,
                            enableOnlineTesting,
                            subjectsPerExperiment,
                        }}
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default GeneralSubjectTypeSettingsModal;
