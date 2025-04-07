import React, { Fragment } from 'react';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePaginationURLSearchParams,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import {
    TableHeadCustomCols,
    TableBodyCustomCols,
} from '@mpieva/psydb-custom-fields-ui';

import {
    Table,
    Alert,
    LoadingIndicator,
    Pagination,
    LocationIconButton,
    LinkContainer,
} from '@mpieva/psydb-ui-layout';

import { CSVExtendedSearchExportButton } from '@mpieva/psydb-ui-lib';

import sanitizeFormData from './sanitize-form-data';

export const Results = (ps) => {
    var { schema, crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = formData;

    var [{ timezone }] = useI18N();
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
                ...saneData, offset, limit, timezone,
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
    } = __fixRelated(fetched.data); // FIXME

    // FIXME
    var displayFieldData = __fixDefinitions(displayFieldData);
   
    // NOTE: there are specail columns that dont appear in
    // definitions
    // FIXME: this is ugly
    var definitions = [];
    var specials = [];
    for (var it of columns) {
        if (it.startsWith('/_special')) {
            specials.push(it)
        }
        else {
            definitions.push(
                displayFieldData.find(def => (def.pointer === it))
            )
        }
    }

    var TableComponent = (
        recordsCount > 0 ? RecordTable : Fallback
    );

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
                definitions,
                records,
                related,
                specials,
            })} />
        </div>
    )
}


const Fallback = (ps) => {
    var [{ translate }] = useI18N();
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
    var { definitions, specials } = ps;
    var [{ translate }] = useI18N();
    return (
        <thead><tr>
            <TableHeadCustomCols definitions={ definitions } />
            { specials.includes('/_specialStudyReverseRefs') && (
                <th>{ translate('Assigned Studies') }</th>
            )}
            <th></th>
        </tr></thead>
    )
}

const TableBody = (ps) => {
    var { definitions, records, related, specials } = ps;

    return (
        <tbody>{ records.map(it => (
            <tr
                key={ it._id }
                className={ it._isHidden && 'bg-light text-grey' }
            >
                <TableBodyCustomCols
                    definitions={ definitions }
                    record={ it }
                    related={ related }
                />
                { specials.includes('/_specialStudyReverseRefs') && (
                    <td>
                        { (it._specialStudyReverseRefs || []).map((it, ix) => (
                            <Fragment key={ ix }>
                                { ix > 0 && ', ' }
                                <a href={ `#/studies/${it.type}/${it._id}` }>
                                    { it.state.shorthand }
                                </a>
                            </Fragment>
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
        ))}</tbody>
    )
}

