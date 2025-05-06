import React from 'react';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import {
    useFetch,
    useRevision,
    useURLSearchParamsB64
} from '@mpieva/psydb-ui-hooks';

const withCoreAndSubjects = () => (NextComponent) => {
    var WithCoreAndSubjects = (ps) => {
        var fullRevision = useRevision();
        var subjectRevision = useRevision();
        var [ query, updateQuery ] = useURLSearchParamsB64();

        var { inspectedFields, items } = query;
        var subjectIds = items.map(it => it._id);
        
        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.readManySubjects({ ids: subjectIds })
        ), [
            subjectIds.join(','),
            fullRevision.value,
            subjectRevision.value,
        ]);

        if (!didFetch) {
            return <LoadingIndicator size='xl' />
        }

        var { records, related, crtSettings } = fetched.data;

        var bag = {
            query, updateQuery, inspectedFields,
            fullRevision, subjectRevision,
            subjectRecords: records, subjectRelated: related,
            subjectCRTSettings: crtSettings
        }
        return <NextComponent { ...bag } />
    }

    return WithCoreAndSubjects;
}

export default withCoreAndSubjects;
