import React from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';

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

import datefns from '@mpieva/psydb-ui-lib/src/date-fns'

import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

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
        recordsCount,
        related,
        displayFieldData,
    } = fetched.data;

    var selectedFieldData = displayFieldData.filter(it => (
        columns.includes(it.dataPointer)
    ));

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
                selectedFieldData,
                records,
                related
            })} />
        </div>
    )
}


const Fallback = (ps) => {
    return (
        <>
            <Table>
                <TableHead { ...ps } />
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
    var { columns, selectedFieldData } = ps;
    var keyed = keyBy({ items: selectedFieldData, byProp: 'dataPointer' });
    return (
        <thead><tr>
            <FieldDataHeadCols { ...({
                displayFieldData: (
                    columns.map(it => keyed[it]).filter(it => !!it)
                ),
            })} />
            { columns.includes('/_specialStudyParticipation') && (
                <th>Studien</th>
            )}
        </tr></thead>
    )
}

const TableBody = (ps) => {
    var { columns, selectedFieldData, records, related } = ps;
    var keyed = keyBy({ items: selectedFieldData, byProp: 'dataPointer' });

    return (
        <tbody>
            { records.map(it => (
                <tr key={ it._id }>
                    <FieldDataBodyCols { ...({
                        record: it,
                        //displayFieldData: selectedFieldData,
                        displayFieldData: (
                            columns.map(it => keyed[it]).filter(it => !!it)
                        ),
                        ...related
                    })} />
                    { columns.includes('/_specialStudyParticipation') && (
                        <ParticipationColumn
                            participation={
                                it
                                .scientific.state
                                .internals.participatedInStudies
                            }
                            related={ related }
                        />
                    )}
                </tr>
            ))}
        </tbody>
    )
}

const ParticipationColumn = (ps) => {
    var { participation, related } = ps;
    var relatedStudies = related.relatedRecordLabels.study;
    return (
        <td>
            {
                participation
                .filter(it => it.status === 'participated')
                .map(it => {
                    var studyLabel = relatedStudies[it.studyId]._recordLabel;
                    var date = datefns.format(new Date(it.timestamp), 'P');
                    return `${studyLabel} (${date})`;
                })
                .join('; ')
            }
        </td>
    )
}
