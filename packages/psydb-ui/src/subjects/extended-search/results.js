import React from 'react';
import jsonpointer from 'jsonpointer';

import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
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
    DetailsIconButton,
    LinkContainer,
} from '@mpieva/psydb-ui-layout';

import { CSVExtendedSearchExportButton } from '@mpieva/psydb-ui-lib';


import datefns from '@mpieva/psydb-ui-lib/src/date-fns'

import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

import sanitizeFormData from './sanitize-form-data';

export const Results = (ps) => {
    var { schema, crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = formData;
    
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var saneData = sanitizeFormData(fieldDefinitions, formData);
        return (
            agent
            .getAxios()
            .post('/api/extended-search/subjects', {
                ...saneData,
                offset,
                limit,
                timezone: getSystemTimezone()
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

    var saneData = sanitizeFormData(fieldDefinitions, formData);

    var selectedFieldData = displayFieldData.filter(it => (
        columns.includes(it.dataPointer)
    ));

    var TableComponent = (
        recordsCount > 0
        ? RecordTable
        : Fallback
    );

    return (
        <div>
            <div className='sticky-top border-bottom d-flex align-items-center bg-light'>
                <div className='flex-grow'>
                    <Pagination { ...pagination } />
                </div>
                <div className='media-print-hidden'>
                    <CSVExtendedSearchExportButton
                        className='ml-3'
                        size='sm'
                        endpoint='subject'
                        searchData={ saneData }
                    />
                </div>
            </div>

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
    console.log(keyed);
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
            { columns.includes('/_specialUpcomingExperiments') && (
                <th>Termine</th>
            )}
            <th></th>
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
                    { columns.includes('/_specialUpcomingExperiments') && (
                        <ExperimentColumn
                            experiments={ it._specialUpcomingExperiments }
                        />
                    )}
                    <td>
                        <div className='d-flex justify-content-end'>
                            <DetailsIconButton
                                to={`/subjects/${it.type}/${it._id}`}
                            />
                        </div>
                    </td>
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
                    var date = datefns.format(new Date(it.timestamp), 'dd.MM.yyyy');
                    return `${studyLabel} (${date})`;
                })
                .join('; ')
            }
        </td>
    )
}

const ExperimentColumn = (ps) => {
    var { experiments, related } = ps;
    var items = (
        experiments
        .map((it, index) => {
            var date = datefns.format(
                new Date(it.state.interval.start), 'dd.MM.yyyy'
            );
            return (
                <LinkContainer to={ `/experiments/${it.type}/${it._id}` }>
                    <a>{ it.state.studyLabel } ({date})</a>
                </LinkContainer>
            );
        })
    );
    return (
        <td>
            { items.map((it, index) => (
                <>
                    { it }{'; '}
                </>
            ))}
        </td>
    )
}
