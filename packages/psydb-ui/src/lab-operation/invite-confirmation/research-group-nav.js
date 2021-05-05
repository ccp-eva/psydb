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
import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';

const ResearchGroupNav = () => {

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        records
    } = state;

    useEffect(() => {
        agent.searchRecords({
            collection: 'researchGroup'
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ /* TODO: anything here?*/ ])

    if (!records) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <BigNav items={
            records.map(it => ({
                label: `Forschungsgruppe ${it._recordLabel}`,
                linkTo: it._id
            }))
        } />
    )
}
const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                records: payload.records,
            }
    }
}

export default ResearchGroupNav;
