import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

export const Results = (ps) => {
    var { formData } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/extended-search/subjects', formData['$'])
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    return (<div />)
}

