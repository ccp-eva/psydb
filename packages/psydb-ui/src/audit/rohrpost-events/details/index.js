import React from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { JsonBase64 } from '@cdxoo/json-base64';

import { urlUp } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    PageWrappers,
    DetailsBoxPlain,
    Pair,
    JsonRaw
} from '@mpieva/psydb-ui-layout';

const Details = () => {
    var { url } = useRouteMatch();
    var { id } = useParams();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchRohrpostEventRecord({ recordId: id  })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    var {
        _id, timestamp, correlationId, collectionName, channelId,
        message: { personnelId }
    } = record;

    var qCorrelationId = JsonBase64.encode({ correlationId })
    var qChannelId = JsonBase64.encode({ channelId })
    return (
        <PageWrappers.Level1
            title='Data Events'
            titleLinkUrl={ urlUp(url, 1) }
        >
            <PageWrappers.Level2 title='Details'>
                <DetailsBoxPlain title='Event Details'>
                    <Pair label='Event ID'>{ _id }</Pair>
                    <Pair label='Timestamp'>{ timestamp }</Pair>
                    <Pair label='Triggered By'>
                        { related.personnel[personnelId] }
                    </Pair>
                    <Pair label='Correlation ID'>
                        <a href={
                            `#/audit/rohrpost-events?q=${qCorrelationId}`
                        }>
                            { correlationId }
                        </a>
                    </Pair>
                    <Pair label='Collection'>{ collectionName }</Pair>
                    <Pair label='Channel ID'>
                        <a href={
                            `#/audit/rohrpost-events?q=${qChannelId}`
                        }>
                            { channelId }
                        </a>
                    </Pair>
                </DetailsBoxPlain>

                <JsonRaw
                    className='mt-4'
                    title='Raw Event Data'
                    data={ record }
                    orderKeys
                />

            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}

export default Details;
