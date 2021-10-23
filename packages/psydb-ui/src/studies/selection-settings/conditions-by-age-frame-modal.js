import React, { useEffect, useReducer } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

import { Modal } from '@mpieva/psydb-ui-layout';

import {
    AgeFrameSettingsListItem,
} from '@mpieva/psydb-schema-fields-special';

const createSchema = ({ subjectTypeData }) => {
    var schema = AgeFrameSettingsListItem({
        subjectRecordType: subjectTypeData.type,
        subjectRecordTypeScientificFields: (
            // FIXME: can we even search for other list fields?
            subjectTypeData.state.settings.subChannelFields.scientific
            .filter(it => it.type !== 'ListOfObjects')
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


const ConditionsByAgeFrameModalOLD = ({
    type,
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

    var formData = (
        type === 'edit'
        ? {
            ageFrame,
            conditions,
        }
        : undefined
    );

    var handleSubmit = ({ formData }) => {
        var message = undefined;

        if (type === 'edit') {
            message = {
                type: 'study/update-age-frame',
                payload: {
                    id: studyRecord._id,
                    lastKnownEventId: studyRecord._lastKnownEventId,
                    customRecordType: subjectRecordType,
                    originalAgeFrame: ageFrame,
                    props: formData,
                }
            };
        }
        else {
            message = {
                type: 'study/add-age-frame',
                payload: {
                    id: studyRecord._id,
                    lastKnownEventId: studyRecord._lastKnownEventId,
                    customRecordType: subjectRecordType,
                    props: formData,
                }
            };
        }

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
                        formData={ formData }
                        onSubmit={ handleSubmit }
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}


const ConditionsByAgeFrameModalBody = (ps) => {
    var {
        modalPayloadData,
        studyData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var {
        type,
        ageFrame,
        conditions,

        subjectRecordType,
        subjectTypeData,
    } = modalPayloadData;

    var {
        record: studyRecord,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = studyData;

    var schema = createSchema({ subjectTypeData });

    var formData = (
        type === 'edit'
        ? {
            ageFrame,
            conditions,
        }
        : undefined
    );

    var send = useSend(({ formData }) => {
        var message = undefined;

        if (type === 'edit') {
            message = {
                type: 'study/update-age-frame',
                payload: {
                    id: studyRecord._id,
                    lastKnownEventId: studyRecord._lastKnownEventId,
                    customRecordType: subjectRecordType,
                    originalAgeFrame: ageFrame,
                    props: formData,
                }
            };
        }
        else {
            message = {
                type: 'study/add-age-frame',
                payload: {
                    id: studyRecord._id,
                    lastKnownEventId: studyRecord._lastKnownEventId,
                    customRecordType: subjectRecordType,
                    props: formData,
                }
            };
        }
        
        return message;
    }, {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    })

    return (
        <SchemaForm
            schema={ schema }
            formContext={{
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
            }}
            formData={ formData }
            onSubmit={ send.exec }
        />
    )
}

const ConditionsByAgeFrameModal = WithDefaultModal({
    title: 'Altersfenster',
    size: 'lg',

    Body: ConditionsByAgeFrameModalBody,
});

export default ConditionsByAgeFrameModal;
