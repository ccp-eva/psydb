import React from 'react';
import { useRouteMatch } from 'react-router';
import { JsonBase64 } from '@cdxoo/json-base64';

import { urlUp } from '@mpieva/psydb-ui-utils';
import {
    useURLSearchParamsB64,
    usePaginationURLSearchParams,
    useFetch
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination,
    PageWrappers,
    ItemsIconButtonInline
} from '@mpieva/psydb-ui-layout';

import {
    QuickSearch
} from '@mpieva/psydb-ui-lib';

const List = () => {
    var { url } = useRouteMatch();

    var [ query, updateQuery ] = useURLSearchParamsB64();
    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .fetchRohrpostEventList({
            ...query,
            offset,
            limit
        })
        .then((response) => {
            pagination.setTotal(response.data.data.total)
            return response;
        })
    ), [ JSON.stringify(query), offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data;

    return (
        <PageWrappers.Level1
            title='Data Events'
            titleLinkUrl={ urlUp(url, 1) }
        >
            <PageWrappers.Level2 title='List'>
                <div className='sticky-top border-bottom'>
                    <QuickSearch
                        target='table'
                        filters={ query }
                        onSubmit={({ filters }) => {
                            updateQuery({ ...filters })
                        }}
                        displayFieldData={[
                            {
                                key: 'eventId',
                                pointer: 'eventId',
                                displayName: 'Event ID',
                                systemType: 'SaneString'
                            },
                            {
                                key: 'triggeredBy',
                                pointer: 'triggeredBy',
                                displayName: 'Triggered By',
                                systemType: 'ForeignId',
                                props: { collection: 'personnel' }
                            },
                            {
                                key: 'correlationId',
                                pointer: 'correlationId',
                                displayName: 'Correlation Id',
                                systemType: 'SaneString',
                            },
                            {
                                key: 'channelId',
                                pointer: 'channelId',
                                displayName: 'Channel ID',
                                systemType: 'SaneString'
                            },
                        ]}
                    />
                    <Pagination
                        { ...pagination }
                        showJump={ false }
                    />
                </div>
                <RecordTable
                    records={ records }
                    related={ related }
                    url={ url }
                />
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    )
}

import {
    Table
} from '@mpieva/psydb-ui-layout';

const RecordTable = (ps) => {
    var { records, ...pass } = ps;
    return (
        <Table>
            <thead>
                <tr>
                    <th>Event ID</th>
                    <th>Timestamp</th>
                    <th>Triggered By</th>
                    <th>CorrelationId</th>
                    <th>Action Type</th>
                    <th>Collection</th>
                    <th>Channel ID</th>
                    {/*<th>Channel Label</th>*/}
                </tr>
            </thead>
            <tbody>
                { records.map((it, ix) => (
                    <TableRow key={ ix } record={ it } { ...pass } />
                ))}
            </tbody>
        </Table>
    )
}

const TableRow = (ps) => {
    var { record, related, url: here } = ps;

    var {
        _id, timestamp, correlationId, collectionName, channelId,
        message: { personnelId },
        
        _messageType
    } = record;

    var qCorrelationId = JsonBase64.encode({ correlationId })
    var qChannelId = JsonBase64.encode({ channelId })
    return (
        <tr>
            <td>
                <a href={`#${here}/${_id}`}>
                    { _id }
                </a>
            </td>
            <td>{ timestamp }</td>
            <td>{ related.personnel[personnelId] }</td>
            <td>
                <a href={`#/audit/rohrpost-events?q=${qCorrelationId}`}>
                    { correlationId }
                </a>
            </td>
            <td>{ _messageType }</td>
            <td>{ collectionName }</td>
            <td>
                <a href={`#/audit/rohrpost-events?q=${qChannelId}`}>
                    { channelId }
                </a>
            </td>
            {/*<td>{ related[collectionName][channelId] }</td>*/}
        </tr>
    )
}

export default List;
