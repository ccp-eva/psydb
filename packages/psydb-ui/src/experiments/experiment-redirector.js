import React from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';

const ExperimentRedirector = () => {
    var { url } = useRouteMatch();
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchOneRecord({ collection: 'experiment', id, projection: {
            type: true, realType: true
        }})
    ), [ id ]);

    if (!didFetch) {
        return null;
    }

    var { record } = fetched.data;
    var { realType, type } = record;

    return (
        <Redirect to={ `${up(url, 1)}/${realType || type}/${id}` } />
    )
}

export default ExperimentRedirector;
