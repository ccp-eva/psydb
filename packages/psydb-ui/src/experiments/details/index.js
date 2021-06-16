import React, { useEffect, useReducer, useCallback } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import General from './general';
import GeneralFunctions from './general-functions';
import Subjects from './subjects';

const ExperimentDetails = () => {
    var { path, url } = useRouteMatch();
    var { experimentType, id } = useParams();
    
    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        revision,
        
        experimentData,
        studyData,
        subjectDataByType,
    } = state;

    useEffect(() => {
        agent.fetchExtendedExperimentData({
            experimentType,
            experimentId: id,
        })
        .then((response) => {
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })
    }, [ experimentType, id ]);

    var onSuccessfulUpdate = useCallback(() => {
        dispatch({ type: 'increase-revision' });
    }, []);

    if (!experimentData) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <div>
            <div className='border bg-light p-3'>
                <General { ...({ experimentData, studyData }) } />
                <hr />
                <div className='mt-3 d-flex justify-content-end'>
                    <GeneralFunctions { ...({
                        experimentData,
                        studyData,
                        onSuccessfulUpdate,
                    }) } />
                </div>
            </div>
            <div>
                <Subjects { ...({
                    experimentData,
                    studyData,
                    subjectDataByType,
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    );
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {

        case 'init-data':
            return ({
                ...state,
                experimentData: payload.experimentData,
                studyData: payload.studyData,
                subjectDataByType: payload.subjectDataByType,
            })

        case 'init-extended-experiment-data':
            return ({
                ...state,
                subjectTypeData: payload.records,
            })

        case 'increase-revision':
            return ({
                ...state,
                revision: (state.revision || 0) + 1
            })
    }
}

export default ExperimentDetails;
