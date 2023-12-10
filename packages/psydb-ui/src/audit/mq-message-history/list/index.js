import React from 'react';
import { useRouteMatch } from 'react-router';

import {
    usePaginationURLSearchParams,
    useFetch
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination,
    PageWrappers,
} from '@mpieva/psydb-ui-layout';

const List = () => {
    var { url } = useRouteMatch();

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .fetchMQMessageHistoryList({ offset, limit })
        .then((response) => {
            pagination.setTotal(response.data.data.total)
            return response;
        })
    ), [ offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data;

    return (
        <PageWrappers.Level2 title='List'>
            <div className='sticky-top border-bottom'>
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
                    <th>Timestamp</th>
                    <th>Action Type</th>
                    <th>Triggered By</th>
                    <th>CorrelationId</th>
                </tr>
            </thead>
            <tbody>
                { records.map(it => (
                    <TableRow record={ it } { ...pass } />
                ))}
            </tbody>
        </Table>
    )
}

const TableRow = (ps) => {
    var { record, related, url: here } = ps;

    var {
        timestamp, _id: correlationId, personnelId,
        message: { type }
    } = record;

    return (
        <tr>
            <td>{ timestamp }</td>
            <td>{ type }</td>
            <td>{ related.personnel[personnelId] }</td>
            <td>
                <a href={`#${here}/${correlationId}`}>
                    { correlationId }
                </a>
            </td>
        </tr>
    )
}

export default List;
