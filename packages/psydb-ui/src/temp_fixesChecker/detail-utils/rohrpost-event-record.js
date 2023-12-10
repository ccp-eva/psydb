import React from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';

import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    JsonRaw
} from '@mpieva/psydb-ui-layout';

import { Label125 } from '../shared-utils';

export const RohrpostEventRecord = (ps) => {
    var { id } = ps;

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
        <div>
            <Label125 text='Correlation ID' />
            <a
                href={`#/audit/rohrpost-events?q=${qCorrelationId}`}
                target='_blank'
            >
                { correlationId }
            </a>
            <br />
            <Label125 text='Target ID' />
            <a
                href={`#/audit/rohrpost-events?q=${qChannelId}`}
                target='_blank'
            >
                { channelId }
            </a>
            <br />
            <JsonRaw
                title='Raw Event Data'
                data={ record }
                orderKeys
            />
        </div>
    )
}
