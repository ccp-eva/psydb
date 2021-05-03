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

import StudyTeamListItem from './team-list-item';
import StudyTeamCreateModal from './team-create-modal';

const StudyTeams = ({
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        records,
        relatedRecordLabels,

        showCreateModal,
        createModalData,
        showDeleteModal,
        deleteModalData,

    } = state;

    var [
        handleShowCreateModal,
        handleShowDeleteModal,
        
        handleHideCreateModal,
        handleHideDeleteModal,

        handleTeamCreated,
        handleTeamDeleted,
    ] = useMemo(() => ([
        (teamId) => dispatch({
            type: 'show-create-modal',
            payload: { teamId }
        }),
        (teamId) => dispatch({
            type: 'show-delete-modal',
            payload: { teamId }
        }),

        () => dispatch({ type: 'hide-create-modal' }),
        () => dispatch({ type: 'hide-delete-modal' }),

        () => dispatch({ type: 'increase-list-revision' }),
        () => dispatch({ type: 'increase-list-revision' }),
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
    }, [ id ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    return (
        <div className='pt-3'>
            <div>
                <Button onClick={ handleShowCreateModal }>
                    Neues Team
                </Button>
            </div>

            <StudyTeamCreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ handleTeamCreated }
                createModalData={ createModalData }
            />

            { records.map(record => (
                <StudyTeamListItem {...({
                    key: record._id,
                    studyId: id,
                    record,
                    relatedRecordLabels,
                    //onEditClick,
                    //onDeleteClick,
                    //enableDelete
                })} />
            ))}
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
                createModalData: {
                    ...payload
                }
            }
        case 'hide-create-modal':
            return {
                ...state,
                showCreateModal: false,
            }
        case 'show-delete-modal':
            return {
                ...state,
                showDeleteModal: true,
                deleteModalData: {
                    ...payload
                }
            }
        case 'hide-delete-modal':
            return {
                ...state,
                showDeleteModal: false
            }
        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }

    }
}

export default StudyTeams;
