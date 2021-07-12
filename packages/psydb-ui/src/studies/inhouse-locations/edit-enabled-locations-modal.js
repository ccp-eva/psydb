import React, { useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

import {
    ExactObject,
    ForeignIdList,
} from '@mpieva/psydb-schema-fields'

const createSchema = ({ locationType }) => {
    var schema = {
        type: 'object',
        properties: {
            enabledLocationIds: ForeignIdList({
                title: 'Ausgewählt',
                collection: 'location',
                recordType: locationType,

                constraints: {
                    '/state/reservationSettings/canBeReserved': true,
                    //'/key': { $nin: existingSubjectTypeKeys }
                }
            })
        }
    };

    return schema;
};


const EditEnabledLocationsModal = ({
    show,
    onHide,

    locationType,
    enabledLocationIds,

    studyRecord,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    onSuccessfulUpdate,
}) => {

    var schema = createSchema({ locationType });

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'study/update-inhouse-test-location-type-settings',
            payload: {
                id: studyRecord._id,
                lastKnownEventId: studyRecord._lastKnownEventId,
                customRecordType: locationType,
                props: formData
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
                <Modal.Title>Rümlichkeiten auswählen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <SchemaForm
                        schema={ schema }
                        formData={{ enabledLocationIds }}
                        formContext={{
                            relatedRecordLabels,
                            relatedHelperSetItems,
                            relatedCustomRecordTypeLabels,
                        }}
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default EditEnabledLocationsModal;
