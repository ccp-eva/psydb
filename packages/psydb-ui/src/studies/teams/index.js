import React, { useEffect, useReducer, useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import StudyTeamListItem from '@mpieva/psydb-ui-lib/src/experiment-operator-team-list-item';

import StudyTeamCreateModal from './team-create-modal';
import StudyTeamEditModal from './team-edit-modal';

const StudyTeams = ({
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        records,
        relatedRecordLabels,

        showCreateModal,
        showEditModal,
        showDeleteModal,
        
        editModalData,
        deleteModalData,

        showHidden,

        listRevision,
    } = state;

    var [
        handleShowCreateModal,
        handleShowEditModal,
        handleShowDeleteModal,
        
        handleHideCreateModal,
        handleHideEditModal,
        handleHideDeleteModal,

        handleTeamCreated,
        handleTeamUpdated,
        handleTeamDeleted,

        handleToggleHidden,
    ] = useMemo(() => ([
        () => dispatch({
            type: 'show-create-modal',
        }),
        (teamId) => dispatch({
            type: 'show-edit-modal',
            payload: { teamId }
        }),
        (teamId) => dispatch({
            type: 'show-delete-modal',
            payload: { teamId }
        }),

        () => dispatch({ type: 'hide-create-modal' }),
        () => dispatch({ type: 'hide-edit-modal' }),
        () => dispatch({ type: 'hide-delete-modal' }),

        () => dispatch({ type: 'increase-list-revision' }),
        () => dispatch({ type: 'increase-list-revision' }),
        () => dispatch({ type: 'increase-list-revision' }),

        () => dispatch({ type: 'toggle-hidden' }),
    ]))

    useEffect(() => {
        agent.fetchExperimentOperatorTeamsForStudy({
            studyId: id
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ id, listRevision ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    return (
        <div className='pt-3'>
            <div className='d-flex justify-content-between mb-3'>
                <Button onClick={ handleShowCreateModal }>
                    Neues Team
                </Button>
                <Button
                    variant={ showHidden ? 'secondary' : 'outline-secondary'}
                    onClick={ handleToggleHidden }>
                    Ausgeblendete anzeigen
                </Button>
            </div>

            <StudyTeamCreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ handleTeamCreated }
                studyId={ id }
            />

            <StudyTeamEditModal
                show={ showEditModal }
                onHide={ handleHideEditModal }
                onSuccessfulUpdate={ handleTeamUpdated }
                editModalData={ editModalData }
                studyId={ id }
            />

            { 
                records
                .filter(it => showHidden || it.state.hidden !== true)
                .map(record => (
                    <StudyTeamListItem {...({
                        key: record._id,
                        studyId: id,
                        record,
                        relatedRecordLabels,
                        onEditClick: handleShowEditModal,
                        //onDeleteClick,
                        //enableDelete
                    })} />
                ))
            }
        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return ({
                ...state,
                records: payload.records,
                relatedRecordLabels: payload.relatedRecordLabels,
            })
        
        case 'show-create-modal':
            return {
                ...state,
                showCreateModal: true,
            }
        case 'hide-create-modal':
            return {
                ...state,
                showCreateModal: false,
            }

        case 'show-edit-modal':
            return {
                ...state,
                showEditModal: true,
                editModalData: {
                    ...payload
                }
            }
        case 'hide-edit-modal':
            return {
                ...state,
                showEditModal: false,
            }

        case 'toggle-hidden':
            return {
                ...state,
                showHidden: !state.showHidden
            }

        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }

    }
}

export default StudyTeams;
