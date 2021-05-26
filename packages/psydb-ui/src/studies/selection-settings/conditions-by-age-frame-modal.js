import React, { useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

import {
    AgeFrameSettingsListItem,
} from '@mpieva/psydb-schema-fields-special';

const createSchema = ({ subjectTypeData }) => {
    var schema = AgeFrameSettingsListItem({
        subjectRecordType: subjectTypeData.type,
        subjectRecordTypeScientificFields: (
            subjectTypeData.state.settings.subChannelFields.scientific
        )
    });

    schema.properties.ageFrame.systemProps = {
        ...schema.properties.ageFrame.systemProps,
        uiWrapper: 'MultiLineWrapper'
    };

    schema.properties.conditions.systemProps = {
        ...schema.properties.conditions.systemProps,
        uiWrapper: 'MultiLineWrapper'
    };

    return schema;
};


const ConditionsByAgeFrameModal = ({
    show,
    onHide,

    ageFrame,
    conditions,

    subjectRecordType,
    subjectTypeData,
    studyRecord,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    onSuccessfulUpdate,
}) => {

    var schema = createSchema({ subjectTypeData });

    var handleSubmit = ({ formData }) => {
        var message = {
            type: 'study/patch-conditions-by-age-frame',
            payload: {
                id: studyRecord._id,
                lastKnownEventId: studyRecord._lastKnownEventId,
                subjectRecordType: subjectRecordType,
                ageFrame: ageFrame, // original frame so we can find stuff
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
                <Modal.Title>Altersfenster bearbeiten</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <div>
                    <SchemaForm
                        schema={ schema }
                        formContext={{
                            relatedRecordLabels,
                            relatedHelperSetItems,
                            relatedCustomRecordTypeLabels,
                        }}
                        formData={{
                            ageFrame,
                            conditions,
                        }}
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ConditionsByAgeFrameModal;
