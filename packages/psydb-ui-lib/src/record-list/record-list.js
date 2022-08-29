import React, { useState, useEffect } from 'react';
import { entries, transliterate } from '@mpieva/psydb-core-utils';

import {
    useFetch,
    usePaginationReducer,
    usePaginationURLSearchParams,
    useSortReducer,
    useSortURLSearchParams,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator,
    Button,
    Icons
} from '@mpieva/psydb-ui-layout';

import QuickSearch from '../quick-search';
import Table from './table';

var RecordList = ({
    target,
    collection,
    recordType,
    constraints,
    excludedIds,
    searchOptions,

    //offset,
    //limit,
    //filters,
    defaultSort,

    enableView,
    enableEdit_old,
    enableRecordRowLink,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,

    showHidden,
    setShowHidden,

    linkBaseUrl,
    tableClassName,
    bsTableProps,
    CustomActionListComponent,
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ payload, setPayload ] = useState([]);

    var [ filters, setFilters ] = (
        (target === 'table' || !target)
        ? useURLSearchParamsB64()
        : useState({})
    );
    var sorter = (
        (target === 'table' || !target)
        ? useSortURLSearchParams()
        : useSortReducer({})
    );
    var { sortPath, sortDirection } = sorter;

    var [ didChangeFilters, setDidChangeFilters ] = useState(false);
    //var [ cachedOffset, setCachedOffset ] = useState(0);

    var pagination = (
        (target === 'table' || !target)
        ? usePaginationURLSearchParams({ offset: 0, limit: 50 })
        : usePaginationReducer({ offset: 0, limit: 50 })
    )
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
            target,
            collection,
            recordType,
            searchOptions,
            offset: (
                didChangeFilters ? 0 : offset
            ),
            limit,
            constraints,
            excludedIds,
            filters: realFilters,
            sort: (
                sortPath
                ? { path: sortPath, direction: sortDirection }
                : defaultSort || undefined
            ),
            showHidden: (
                target === 'table'
                ? realShowHidden
                : showHidden
            )
        })
        .then((response) => {
            setDidChangeFilters(false);
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        });
    }, [
        collection, recordType, offset, limit,
        filters, searchOptions, showHidden, sortPath, sortDirection
    ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        records,
        recordsCount,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels
    } = fetched.data;
  
    return (
        <>
            <div className='sticky-top border-bottom'>
                <div className='d-flex justify-content-between bg-light border-bottom'>
                    <QuickSearch
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
                            if (target && target !== 'table') {
                                setShowHidden(true);
                            }
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
                                Ausgeblendete anzeigen
                            </span>
                        </div>
                    </div>
                </div>
                <Pagination
                    { ...pagination }
                    showJump={ target === 'table' || !target }
                />
            </div>

            <Table { ...({
                className: tableClassName,

                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                enableView,
                enableEdit_old,
                enableRecordRowLink,

                enableSelectRecords,
                showSelectionIndicator,
                onSelectRecord,
                selectedRecordIds,

                sorter,

                linkBaseUrl,
                bsTableProps,
                CustomActionListComponent,
            })} />
        </>
    )
}





export default RecordList;
