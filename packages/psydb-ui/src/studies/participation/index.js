import React, { useEffect, useReducer, useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import agent from '@mpieva/psydb-ui-request-agents';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';

import ParticipationList from './participation-list';

const StudyParticipation = ({}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        subjectRecordTypes,
        dataBySubjectType,
        selectedSubjectType,
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

    if (!dataBySubjectType || !subjectRecordTypes) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    if (!selectedSubjectType) {
        selectedSubjectType = Object.keys(dataBySubjectType)[0];
    }

    return (
        <div className='mt-3'>

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
           
            <div className='mt-2'>
                <ParticipationList
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
    }
}
        
export default StudyParticipation;
