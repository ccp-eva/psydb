import React from 'react';
import jsonpointer from 'jsonpointer';

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
    
    var { columns } = formData['$'];
    columns = Object.keys(columns).filter(key => !!columns[key]);
    
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {

        return (
            agent
            .getAxios()
            .post('/api/extended-search/subjects', {
                ...formData['$'],
                columns,
                offset,
                limit
            })
            .then((response) => {
                pagination.setTotal(response.data.data.recordsCount);
                return response;
            })
        )
    }, [ offset, limit ]);

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
                columns,
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
    var { columns } = ps;
    return (
        <thead><tr>
            { columns.map(col => (
                <th key={ col }>{ col}</th>
            ))}
        </tr></thead>
    )
}

const TableBody = (ps) => {
    var { columns, records } = ps;
    return (
        <tbody>
            { records.map(it => (
                <tr key={ it._id }>
                    { columns.map(col => (
                        <td key={ col }>{ jsonpointer.get(it, col) }</td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}
