import React, { useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

const GeneralSubjectTypeSettingsModal = ({
    show,
    onHide,

    schema,
    externalLocationGrouping,
    enableOnlineTesting,
    subjectRecordType,
    studyRecord,

    onSuccessfulUpdate,
}) => {

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'study/patch-selection-settings-by-subject-type',
            payload: {
                id: studyRecord._id,
                lastKnownEventId: studyRecord._lastKnownEventId,
                subjectRecordType: subjectRecordType,
                props: formData,
            }
        };

        agent.send({ message }).then(response => {
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
                            enableOnlineTesting
                        }}
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default GeneralSubjectTypeSettingsModal;
