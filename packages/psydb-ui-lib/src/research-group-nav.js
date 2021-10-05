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
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    BigNav
} from '@mpieva/psydb-ui-layout';

const ResearchGroupNav = () => {

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.searchRecords({
            collection: 'researchGroup'
        });
    }, []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;

    return (
        <BigNav items={
            records.map(it => ({
                label: `Forschungsgruppe ${it._recordLabel}`,
                linkTo: it._id
            }))
        } />
    )
}

export default ResearchGroupNav;
