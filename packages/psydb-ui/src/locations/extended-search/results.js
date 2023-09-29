import React from 'react';
import { keyBy, jsonpointer } from '@mpieva/psydb-core-utils';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePaginationURLSearchParams,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    Alert,
    LoadingIndicator,
    Pagination,
    LocationIconButton,
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
    
    var permissions = usePermissions();
    var canUseCSVExport = permissions.hasFlag('canUseCSVExport');

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var saneData = sanitizeFormData(fieldDefinitions, formData);
        return (
            agent
            .getAxios()
            .post('/api/extended-search/locations', {
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

    var saneData = sanitizeFormData(fieldDefinitions, formData);

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
            <div className='sticky-top border-bottom d-flex align-items-center bg-light'>
                <div className='flex-grow'>
                    <Pagination { ...pagination } />
                </div>
                {/*<div className='media-print-hidden'>
                    { canUseCSVExport && (
                        <CSVExtendedSearchExportButton
                            className='ml-3'
                            size='sm'
                            endpoint='location'
                            searchData={ saneData }
                        />
                    )}
                </div>*/}
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
    var translate = useUITranslation();
    return (
        <>
            <Table>
                <TableHead { ...ps } />
            </Table>
            <Alert variant='info'>
                <i>{ translate('No Records found.') }</i>
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
    var translate = useUITranslation();
    var keyed = keyBy({ items: selectedFieldData, byProp: 'dataPointer' });
    return (
        <thead><tr>
            <FieldDataHeadCols { ...({
                displayFieldData: (
                    columns.map(it => keyed[it]).filter(it => !!it)
                ),
            })} />
            { columns.includes('/_specialStudyReverseRefs') && (
                <th>{ translate('Assigned Studies') }</th>
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
                <tr
                    key={ it._id }
                    className={ it._isHidden && 'bg-light text-grey' }
                >
                    <FieldDataBodyCols { ...({
                        record: it,
                        //displayFieldData: selectedFieldData,
                        displayFieldData: (
                            columns.map(it => keyed[it]).filter(it => !!it)
                        ),
                        ...related
                    })} />
                    { columns.includes('/_specialStudyReverseRefs') && (
                        <td>
                            { (it._specialStudyReverseRefs || []).map((it, index) => (
                                <>
                                    { index > 0 && ', ' }
                                    <a href={ `#/studies/${it.type}/${it._id}` }>
                                        { it.state.shorthand }
                                    </a>
                                </>
                            )) }
                        </td>
                    )}
                    <td>
                        <div className='d-flex justify-content-end'>
                            <LocationIconButton
                                to={`/locations/${it.type}/${it._id}`}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

