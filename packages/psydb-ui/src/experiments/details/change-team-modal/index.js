import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import StudyTeamListItem from '@mpieva/psydb-ui-lib/src/experiment-operator-team-list-item';

const ChangeTeamModal = ({
    show,
    onHide,
    
    experimentId,
    studyId,
    currentTeamId,

    onSuccessfulUpdate,
}) => {
    var [ selectedTeamId, handleSelectTeam ] = useState(currentTeamId);

    var handleSubmit = useCallback(() => {
        var message = {
            type: 'experiment/change-experiment-operator-team',
            payload: {
                experimentId,
                experimentOperatorTeamId: selectedTeamId
            }
        };

        return agent.send({ message }).then(response => {
            onHide();
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }, [ experimentId, selectedTeamId, onSuccessfulUpdate ])

    if (!experimentId || !studyId) {
        return null;
    }

    return (

        <Modal
            show={show}
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
                        Seichern
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

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        records,
        relatedRecordLabels,
    } = state;

    useEffect(() => {
        agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ studyId ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

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

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                records: payload.records,
                relatedRecordLabels: payload.relatedRecordLabels,
            }
        
        case 'select-team':
            return {
                ...state,
                selectedTeamId: payload.teamId
            }

    }
}

export default ChangeTeamModal;
