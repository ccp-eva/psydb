import React from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { urlUp } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    PageWrappers,
    DetailsBoxPlain,
    Pair,
} from '@mpieva/psydb-ui-layout';

const Details = () => {
    var { url } = useRouteMatch();
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchMQMessageHistoryRecord({ correlationId: id  })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    var {
        timestamp, _id: correlationId, personnelId,
        message: { type }
    } = record;

    return (
        <PageWrappers.Level1
            title='Action History'
            titleLinkUrl={ urlUp(url, 1) }
        >
            <PageWrappers.Level2 title='Details'>
                <DetailsBoxPlain title='Action Details'>
                    <Pair label='Timestamp'>{ timestamp }</Pair>
                    <Pair label='Action Type'>{ type }</Pair>
                    <Pair label='Triggered By'>
                        { related.personnel[personnelId] }
                    </Pair>
                    <Pair label='Correlation ID'>{ correlationId }</Pair>
                </DetailsBoxPlain>
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}

export default Details;
