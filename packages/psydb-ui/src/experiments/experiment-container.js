import React, { useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    useFetch,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import Details from './details';
import Postprocessing from './postprocessing';
import Finalized from './finalized';

const ExperimentContainer = () => {
    var { path, url } = useRouteMatch();
    var { experimentType, id } = useParams();

    var { value: revision, up: incrementRevision } = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExtendedExperimentData({
            experimentType,
            experimentId: id,
        })
    }, [ experimentType, id, revision ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { experimentData: { record }} = fetched.data;
    var { interval, isCanceled, isPostprocessed } = record.state;

    var now = new Date(),
        experimentStart = new Date(interval.start);

    var shouldDisplayPostprocessing = (
        !isCanceled && !isPostprocessed && experimentStart < now
    );

    var downstream = {
        url,
        path,
        experimentType,
        id,
        onSuccessfulUpdate: incrementRevision,
        ...fetched.data,
    };

    if (isPostprocessed) {
        return <Finalized { ...downstream } />
    }
    else if (shouldDisplayPostprocessing) {
        return <Postprocessing { ...downstream } />
    }
    else {
        return <Details { ...downstream } />
    }

}

export default ExperimentContainer;
