import React from 'react';
import { useFetchAll, useRevision } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

const ExperimentSettings = ({
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    
    var [ revision, increaseRevision ] = useRevision();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        var promises = {
            variants: agent.fetchExperimentVariants({
                studyId: id,
            }),
            settings: agent.fetchExperimentVariantSettings({
                studyId: id,
            })
        }
        return promises;
    }, [ id, revision ])

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var variantRecords = fetched.variants.data.records;
    var settingRecords = fetched.settings.data.records;

    return (
        <div className='mt-3 mb-3'>
            Foo
        </div>
    )
}

export default ExperimentSettings;
