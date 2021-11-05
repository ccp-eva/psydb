import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';
import { Split } from '@mpieva/psydb-ui-layout';

import { SchemaForm } from '../schema-form';
import ExperimentIntervalSummary from '../experiment-interval-summary';

import {
    ExactObject,
    DefaultBool,
    FullText,
    SaneString,
    UnparticipationStatus,
} from '@mpieva/psydb-schema-fields';

import {
    BlockFromTesting
} from '@mpieva/psydb-schema-fields-special';

var schema = ExactObject({
    properties: {

        unparticipateStatus: UnparticipationStatus({ title: 'Grund' }),
        blockSubjectFromTesting: BlockFromTesting({ title: 'Proband sperren' }),
        subjectComment: FullText({ title: 'Kommentar zum Probanden' }),
    },
    required: [
        'unparticipateStatus',
        'subjectComment',
        'blockSubjectFromTesting'
    ],
})

const RemoveSubjectModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    subjectDataByType,
    payloadData,

    onSuccessfulUpdate,
}) => {
    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var {
        subjectId,
        subjectType
    } = payloadData;

    var subjectData = experimentData.record.state.subjectData.find(it => (
        it.subjectId === subjectId
    ));

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    var handleSubmit = createSend(({ formData }) => ({
        type: 'experiment/remove-subject',
        payload: {
            experimentId: experimentData.record._id,
            subjectId,
            ...formData
        }
    }), { onSuccessfulUpdate: wrappedOnSuccessfulUpdate });

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='lg'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Proband austragen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                
                <Split>
                    <div>
                        <header><b>Proband</b></header>
                        <div className='pt-2 pb-2 pl-4 mb-1'>{
                            subjectRecord._recordLabel
                        }</div>
                        <header><b>Kommentar im Termin</b></header>
                        <div className='pt-2 pb-2 pl-4 mb-1'><i>{
                            subjectData.comment
                        }</i></div>
                    </div>
                    
                    <div>
                        <header className='pb-1'><b>Zeitpunkt</b></header>
                        <div className='p-2 bg-white border'>
                            <ExperimentIntervalSummary
                                experimentRecord={ experimentData.record }
                            />
                        </div>
                    </div>
                </Split>
                
                <hr />

                <SchemaForm
                    schema={ schema }
                    formData={{
                        blockSubjectFromTesting: { shouldBlock: false },
                        subjectComment: subjectRecord.scientific.state.comment,
                    }}
                    onSubmit={ handleSubmit }
                />
            </Modal.Body>
        </Modal>
    )
}

const RemoveSubjectModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <RemoveSubjectModal { ...ps } />
    );
}


export default RemoveSubjectModalWrapper;
