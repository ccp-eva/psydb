import React from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import useFetchAll from '@mpieva/psydb-ui-lib/src/use-fetch-all';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

const Participation = ({ id }) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        return {
            fetchRecordTypeMetadata: agent.readCustomRecordTypeMetadata(),
            fetchParticipationData: agent.fetchParticipatedStudiesForSubject({
                subjectId: id,
            })
        }
    }, [ id ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    var {
        fetchRecordTypeMetadata: { data: recordTypeMetadata },
        fetchParticipationData: { data: participationData }
    } = fetched;

    return (
        <div>P</div>
    );
}

export default Participation;
