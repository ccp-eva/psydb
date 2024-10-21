import React from 'react';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import ServerTimezoneContext from '@mpieva/psydb-ui-lib/src/server-timezone-context';

import TheComponent from '@mpieva/psydb-ui-lib/src/option-list/';

const MainIsolation = (ps) => {
    var { onSignedOut } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchServerTimezone()
    ), [])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var serverTimezone = fetched.data.timezone;

    return (
        <ServerTimezoneContext.Provider value={ serverTimezone }>
            <TheComponent />
        </ServerTimezoneContext.Provider>
    )
}

export default MainIsolation;
