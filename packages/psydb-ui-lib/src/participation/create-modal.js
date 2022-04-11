import React, { useState } from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Form,
} from '@mpieva/psydb-ui-layout';

import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const ParticipationCreateModalBody = (ps) => {
    var {
        studyId,
        studyRecordType,
        subjectId,
        subjectRecordType,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var [
        selectedStudyType, setSelectedStudyType
    ] = useState(studyRecordType);

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection: 'study' })
    ), []);

    var send = useSend((formData) => ({
        type: 'subject/add-manual-participation',
        payload: {
            studyId,
            subjectId,
            ...formData,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]});

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var studyTypes = fetched.data;
    if (studyTypes.length === 1) {
        selectedStudyType = studyRecordType = studyTypes[0].type;
    }

    var enableStudyId = !studyId;
    var enableSubjectId = !subjectId;

    var initialValues = MainForm.createDefaults();
    return (
        <>
            { enableStudyId && !studyRecordType && (
                <Form.Group className='row ml-0 mr-0'>
                    <Form.Label className='col-sm-3 col-form-label'>
                        Studien-Typ
                    </Form.Label>
                    <div className='col-sm-9 pl-0 pr-0'>
                        <Controls.GenericEnum
                            value={ selectedStudyType }
                            onChange={ setSelectedStudyType }
                            options={ studyTypes.reduce((acc, it) => ({
                                ...acc, [it.type]: it.label
                            }), {}) }
                        />
                    </div>
                </Form.Group>
            )}
            { (!enableStudyId || enableStudyId && selectedStudyType) && (
                <MainForm.Component
                    enableStudyId={ enableStudyId }
                    studyType={ selectedStudyType }
                    enableSubjectId={ enableSubjectId }
                    subjectType={ subjectRecordType }

                    initialValues={ initialValues }
                    onSubmit={ send.exec }
                />
            )}
        </>
    );
}

const ParticipationCreateModal = WithDefaultModal({
    title: 'Probanden hinzufügen',
    size: 'lg',

    Body: ParticipationCreateModalBody
});

export default ParticipationCreateModal;
