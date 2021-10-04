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

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import agent from '@mpieva/psydb-ui-request-agents';

import {
    LoadingIndicator,
    TabNav,
} from '@mpieva/psydb-ui-layout';

import ParticipationList from './participation-list';
import ParticipationCreateModal from './participation-create-modal';

const StudyParticipation = ({}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        subjectRecordTypes,
        dataBySubjectType,
        selectedSubjectType,

        showCreateModal,

        listRevision
    } = state;

    useEffect(() => {
        agent.readCustomRecordTypeMetadata()
        .then(response => {
            dispatch({ type: 'init-subject-record-types', payload: {
                ...response.data.data
            }})
        });
        
        agent.fetchParticipatedSubjectsForStudy({
            studyId: id
        })
        .then(response => {
            dispatch({ type: 'init-subject-data', payload: {
                ...response.data.data
            }})
        })
    }, [ id, listRevision ])

    var [
        handleShowCreateModal,
        handleHideCreateModal,
        
        handleParticipationCreated,
    ] = useMemo(() => ([
        () => dispatch({ type: 'show-create-modal' }),
        () => dispatch({ type: 'hide-create-modal' }),

        () => dispatch({ type: 'increase-list-revision' }),
    ]));

    if (!dataBySubjectType || !subjectRecordTypes) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    if (!selectedSubjectType) {
        selectedSubjectType = Object.keys(dataBySubjectType)[0];
    }
    else {
        // FIXME: what?
        selectedSubjectType = selectedSubjectType.subjectType;
    }

    return (
        <div className='mt-3'>

            <ParticipationCreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ handleParticipationCreated }
                studyId={ id }
                subjectRecordType={ selectedSubjectType }
            />

            <TabNav
                activeKey={ selectedSubjectType }
                items={ Object.keys(dataBySubjectType).map(type => ({
                    key: type,
                    label: subjectRecordTypes[type].state.label
                }))}
                onItemClick={ (nextKey) => {
                    dispatch({ type: 'select-subject-type', payload: {
                        subjectType: nextKey
                    }})
                }}
            />

            <div className='mt-3'>

                <Button onClick={ handleShowCreateModal }>
                    Probanden hinzufügen
                </Button>

                <ParticipationList
                    className='mt-1 bg-white'
                    { ...dataBySubjectType[selectedSubjectType] } 
                />
            </div>

        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-subject-data':
            return ({
                ...state,
                dataBySubjectType: payload.dataBySubjectType
            })
        case 'init-subject-record-types':
            return ({
                ...state,
                subjectRecordTypes: (
                    keyBy({
                        items: payload.customRecordTypes.filter(it => (
                            it.collection === 'subject'
                        )),
                        byProp: 'type',
                    })
                )
            })
        case 'select-subject-type':
            return ({
                ...state,
                selectedSubjectType: payload
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

        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }
    }
}
        
export default StudyParticipation;
