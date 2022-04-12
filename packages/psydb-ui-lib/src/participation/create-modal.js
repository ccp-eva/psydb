import React, { useState } from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useFetchAll, useSend } from '@mpieva/psydb-ui-hooks';

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

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        studyTypes: agent.fetchCollectionCRTs({ collection: 'study' }),
        subjectTypes: agent.fetchCollectionCRTs({ collection: 'subject' }),
    }), []);

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

    var studyTypes = fetched.studyTypes.data;
    var subjectTypes = fetched.subjectTypes.data;

    var enableStudyId = !studyId;
    var enableSubjectId = !subjectId;

    var initialValues = {
        ...MainForm.createDefaults(),
        studyId,
        subjectId,

        ...(studyTypes.length === 1 && {
            studyType: studyTypes[0].type
        }),
        ...(studyRecordType && {
            studyType: studyRecordType
        }),

        ...(subjectTypes.length === 1 && {
            subjectType: subjectTypes[0].type
        }),
        ...(subjectRecordType && {
            subjectType: subjectRecordType
        }),

    };

    return (
        <>
            {/* enableStudyId && !studyRecordType && (
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
            )*/}
            { (!enableStudyId || enableStudyId && selectedStudyType) && (
                <MainForm.Component
                    enableStudyId={ enableStudyId }
                    studyTypes={ studyTypes }
                    enableSubjectId={ enableSubjectId }
                    subjectTypes={[ subjectRecordType ]}

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
