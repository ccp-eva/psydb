import React, { useState } from 'react';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';
import {
    Modal,
    Button,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields } from '../../formik';

import StudyTeamListItem from '../../experiment-operator-team-list-item';

const ChangeTeamModal = ({
    show,
    onHide,
    
    experimentType,
    experimentId,
    studyId,
    currentTeamId,

    onSuccessfulUpdate,
}) => {
    var [ selectedTeamId, handleSelectTeam ] = useState(currentTeamId);

    if (!experimentId || !studyId) {
        return null;
    }

    var handleSubmit = createSend((formData) => ({
        type: 'experiment/change-experiment-operator-team',
        payload: {
            experimentId,
            experimentOperatorTeamId: formData.experimentOperatorTeamId,
            shouldRemoveOldReservation: formData.shouldRemoveOldReservation,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (

        <Modal
            show={ show }
            onHide={ onHide }
            size='md'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Team ändern</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <ChangeOpsTeamForm { ...({
                    experimentType,
                    experimentId,
                    studyId,
                    selectedTeamId,
                    onSubmit: handleSubmit
                }) } />
            </Modal.Body>
        </Modal>
    );
}

const ChangeOpsTeamForm = (ps) => {
    var {
        experimentType,
        experimentId,
        studyId,
        selectedTeamId,
        onSubmit
    } = ps;

    var initialValues = {
        experimentOperatorTeamId: selectedTeamId,
        shouldRemoveOldReservation: false
    };
    return (
        <DefaultForm
            onSubmit={ onSubmit }
            initialValues={ initialValues }
        >
            { (formikProps) => {
                var { getFieldProps, setFieldValue } = formikProps;
                var teamIdPath = '$.experimentOperatorTeamId';
                var teamId = (
                    getFieldProps(teamIdPath).value
                );
                return (
                    <>
                        <TeamList {...({
                            experimentId,
                            studyId,
                            selectedTeamId: teamId,
                            onSelectTeam: (value) => (
                                setFieldValue(teamIdPath, value)
                            ),
                        }) } />
                        <hr />
                        <div className='d-flex justify-content-between'>
                            { 
                                experimentType === 'away-team'
                                ? (
                                    <Fields.PlainCheckbox
                                        dataXPath='$.shouldRemoveOldReservation'
                                        label='Alte Reservierung entfernen'
                                    />
                                )
                                : <div />
                            }
                            <Button type='submit'>
                                Speichern
                            </Button>
                        </div>
                    </>
                );
            }}
        </DefaultForm>
    )
}

const TeamList = ({
    studyId,
    selectedTeamId,
    onSelectTeam,
}) => {

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        });
    }, [ studyId ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    var {
        records,
        relatedRecordLabels
    } = fetched.data;

    return (
        <>
            { 
                records
                .filter(it => it.state.hidden !== true)
                .map(record => (
                    <StudyTeamListItem {...({
                        key: record._id,
                        studyId,
                        record,
                        relatedRecordLabels,
                        onClick: onSelectTeam,
                        active: record._id === selectedTeamId
                        //onEditClick: handleShowEditModal,
                        //onDeleteClick,
                        //enableDelete
                    })} />
                ))
            }
        </>
    );
}

const ChangeTeamModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <ChangeTeamModal { ...ps } />
    );
}


export default ChangeTeamModal;
