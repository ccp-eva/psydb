import React from 'react';
import { useParams } from 'react-router';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    PageWrappers,
} from '@mpieva/psydb-ui-layout';

import { UpdateSummary } from '../shared-utils';
import { JsonRaw, Chunks } from '../detail-utils';

const FixedImportEventDetails = () => {
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchFixedEventDetails({ updateId: id })
    ), [ id ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { update, related } = fetched.data;
    var { ops } = update;

    return (
        <PageWrappers.Level1 title='Fixed Import-Events'>
            <PageWrappers.Level2 title='Details'>
                <UpdateSummary update={ update } />
                <Chunks update={ update } related={ related } />
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}



export default FixedImportEventDetails;
