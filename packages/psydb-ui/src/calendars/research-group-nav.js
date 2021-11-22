import React from 'react';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Redirect,
    useRouteMatch,
} from 'react-router-dom';

import {
    LoadingIndicator,
    BigNav,
    Alert,
} from '@mpieva/psydb-ui-layout';

const ResearchGroupNav = (ps) => {
    var { url } = useRouteMatch();
    var {
        autoRedirect,
        filterIds
    } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().get('/api/self/research-groups')
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }


    var { records } = fetched.data;

    if (filterIds) {
        records = records.filter(it => filterIds.includes(it._id))
    }

    if (records.length === 0) {
        return (
            <Alert variant='info'>
                <i>Keine Forschungsgruppen gefunden</i>
            </Alert>
        )
    }

    if (autoRedirect && records.length === 1) {
        return <Redirect to={ `${url}/${records[0]._id}` } />
    }

    return (
        <BigNav items={
            fetched.data.records.map(it => ({
                label: `Forschungsgruppe ${it._recordLabel}`,
                linkTo: it._id
            }))
        } />
    )
}

export default ResearchGroupNav;
