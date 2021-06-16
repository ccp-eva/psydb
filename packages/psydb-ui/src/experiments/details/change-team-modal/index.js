import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
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
    var [ state, dispatch ] = useReducer(reducer, {
        selectedTeamId: currentTeamId,
    });
    var {
        records,
        relatedRecordLabels,
        selectedTeamId,

        listRevision,
    } = state;

    var handleSelectTeam = useCallback((teamId) => {
        dispatch({ type: 'select-team', payload: { teamId }});
    }, [])

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
    }, [ experimentId, selectedTeamId ])

    if (!experimentId || !studyId) {
        return null;
    }

    useEffect(() => {
        agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ studyId, listRevision ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        ) 
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
                { 
                    records
                    .filter(it => it.state.hidden !== true)
                    .map(record => (
                        <StudyTeamListItem {...({
                            key: record._id,
                            studyId,
                            record,
                            relatedRecordLabels,
                            onClick: handleSelectTeam,
                            active: record._id === selectedTeamId
                            //onEditClick: handleShowEditModal,
                            //onDeleteClick,
                            //enableDelete
                        })} />
                    ))
                }
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

        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }

    }
}

export default ChangeTeamModal;
