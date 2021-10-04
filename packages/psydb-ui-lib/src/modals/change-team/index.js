import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';
import LoadingIndicator from '../../loading-indicator';
import StudyTeamListItem from '../../experiment-operator-team-list-item';

const ChangeTeamModal = ({
    show,
    onHide,
    
    experimentId,
    studyId,
    currentTeamId,

    onSuccessfulUpdate,
}) => {
    var [ selectedTeamId, handleSelectTeam ] = useState(currentTeamId);

    if (!experimentId || !studyId) {
        return null;
    }

    var handleSubmit = createSend(() => ({
        type: 'experiment/change-experiment-operator-team',
        payload: {
            experimentId,
            experimentOperatorTeamId: selectedTeamId
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
                <TeamList {...({
                    experimentId,
                    studyId,
                    selectedTeamId,
                    onSelectTeam: handleSelectTeam,
                }) } />
                <hr />
                <div className='d-flex justify-content-end'>
                    <Button onClick={ handleSubmit }>
                        Speichern
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
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
