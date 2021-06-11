import React, { useEffect, useReducer } from 'react';

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

const ExperimentDetails = () => {
    var { path, url } = useRouteMatch();
    var { experimentType, id } = useParams();
    
    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        revision,

        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,


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

    if (!record) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <div>fooo</div>
    );
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {

        case 'init-data':
            return ({
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
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
