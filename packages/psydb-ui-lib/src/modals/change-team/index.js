import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    Button,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields } from '../../formik';
import StudyTeamListItem from '../../experiment-operator-team-list-item';

const ChangeTeamModalBody = (ps) => {
    var {
        onHide,
        
        experimentType,
        experimentId,
        studyId,
        currentTeamId,

        onSuccessfulUpdate,
    } = ps;

    var [ selectedTeamId, handleSelectTeam ] = useState(currentTeamId);

    if (!experimentId || !studyId) {
        return null;
    }

    var send = useSend((formData) => ({
        type: 'experiment/change-experiment-operator-team',
        payload: {
            experimentId,
            experimentOperatorTeamId: formData.experimentOperatorTeamId,
            shouldRemoveOldReservation: formData.shouldRemoveOldReservation,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <>
            <ChangeOpsTeamForm { ...({
                experimentType,
                experimentId,
                studyId,
                selectedTeamId,
                onSubmit: send.exec
            }) } />
        </>
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

    var translate = useUITranslation();

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
                                        label={ translate('Remove Old Reservation') }
                                    />
                                )
                                : <div />
                            }
                            <Button type='submit'>
                                { translate('Save') }
                            </Button>
                        </div>
                    </>
                );
            }}
        </DefaultForm>
    )
}

// FIXME: make formik field
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

const ChangeTeamModal = WithDefaultModal({
    Body: ChangeTeamModalBody,

    size: 'md',
    title: 'Change Team',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default ChangeTeamModal;
