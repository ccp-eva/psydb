import React, { useState } from 'react';

import { entries } from '@mpieva/psydb-core-utils';
import { useUILanguage, useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePaginationURLSearchParams,
    useSortURLSearchParams,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator,
    Button,
    Icons
} from '@mpieva/psydb-ui-layout';

import { QuickSearch } from '@mpieva/psydb-ui-lib';
import { Table } from '@mpieva/psydb-ui-lib/src/record-list';

const HelperSetDefaultList = (ps) => {
    var {
        linkBaseUrl,

        canSort,
        defaultSort,
        showHidden,
        setShowHidden,
        
        tableClassName,
        bsTableProps,
        CustomActionListComponent,
    } = ps;
    
    var [ language ] = useUILanguage();
    var translate = useUITranslation();

    var [ didChangeFilters, setDidChangeFilters ] = useState(false);
    var [ filters, setFilters ] = useURLSearchParamsB64();
    
    var sorter = useSortURLSearchParams();
    var { sortPath, sortDirection } = sorter;
    
    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 });
    var { offset, limit } = pagination;
    
    // FIXME: this renders twice; we need to
    // add function to set Offset manually in pagination hook
    // and then use the flag below as dependency in effect
    // var didOffsetChange = ( offset !== cachedOffset );
    var [ didFetch, fetched ] = useFetch((agent) => {
        if (didChangeFilters) {
            pagination.selectSpecificPage(0);
        }

        var { showHidden: realShowHidden, ...realFilters } = filters;

        return agent.searchRecords({
            target: 'table',
            collection: 'helperSet',
            offset: (
                didChangeFilters ? 0 : offset
            ),
            limit,
            filters: realFilters,
            sort: (
                sortPath
                ? { path: sortPath, direction: sortDirection }
                : defaultSort || undefined
            ),
            showHidden: realShowHidden
        })
        .then((response) => {
            setDidChangeFilters(false);
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        });
    }, [
        offset, limit,
        filters, showHidden, sortPath, sortDirection
    ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    
    var {
        records,
        recordsCount,
        displayFieldData,

        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypes
    } = fetched.data;

    console.log(displayFieldData)

    return (
        <>
            <div className='sticky-top border-bottom'>
                <div className='d-flex justify-content-between bg-light border-bottom'>
                    <QuickSearch
                        target='table'
                        filters={ filters }
                        displayFieldData={ displayFieldData }
                        onSubmit={ ({ filters }) => {
                            setDidChangeFilters(true);
                            setFilters({
                                ...filters,
                                showHidden: (
                                    entries(filters || {})
                                    .filter(it => it[1])
                                    .length > 0
                                )
                            });
                        }}
                    />
                    <div className='pt-2 px-3'>
                        <div
                            role='button'
                            className='d-flex align-items-center text-primary'
                            onClick={ () => setShowHidden(!showHidden) }
                        >
                            {
                                showHidden 
                                ? <Icons.CheckSquareFill />
                                : <Icons.Square />
                            }
                            <span className='ml-2'>
                                { translate('Show Hidden') }
                            </span>
                        </div>
                    </div>
                </div>
                <Pagination { ...pagination } showJump />
            </div>
            
            <Table { ...({
                className: tableClassName,

                records,
                displayFieldData,

                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypes,

                canSort,
                sorter,

                linkBaseUrl,
                bsTableProps,
                CustomActionListComponent,
            })} />
        </>
    )
}

export default HelperSetDefaultList;
