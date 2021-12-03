import React from 'react';
import {
    useFetch,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    Alert,
    LoadingIndicator,
    Pagination,
} from '@mpieva/psydb-ui-layout';

export const Results = (ps) => {
    var { schema, formData } = ps;
    
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent
        .getAxios()
        .post('/api/extended-search/subjects', {
            ...formData['$'],
            offset,
            limit
        })
        .then((response) => {
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        })
    ), [ offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        records,
        recordsCount
    } = fetched.data;

    var TableComponent = (
        recordsCount > 0
        ? RecordTable
        : Fallback
    )

    return (
        <div>
            <Pagination { ...pagination } />

            <TableComponent { ...({
                records
            })} />
        </div>
    )
}


const Fallback = (ps) => {
    return (
        <>
            <Table>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>Keine Datensätze gefunden</i>
            </Alert>
        </>
    )
}

const RecordTable = (ps) => {
    return (
        <Table>
            <TableHead { ...ps } />
            <TableBody { ...ps } />
        </Table>
    );
}

const TableHead = (ps) => {
    return (
        <thead><tr>
            <th>ID</th>
        </tr></thead>
    )
}

const TableBody = (ps) => {
    var { records } = ps;
    return (
        <tbody>
            { records.map(it => (
                <tr key={ it._id }>
                    <td>{ it._id }</td>
                </tr>
            ))}
        </tbody>
    )
}
