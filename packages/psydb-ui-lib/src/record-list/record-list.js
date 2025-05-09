import React, { useState, useEffect } from 'react';
import { entries, transliterate } from '@mpieva/psydb-core-utils';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

var RecordList = (ps) => {
    var {
        target = 'table',
        collection,
        recordType,
        constraints,
        extraIds,
        excludedIds,
        searchOptions,

        //offset,
        //limit,
        //filters,
        canSort,
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
    } = ps;

    var translate = useUITranslation();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ payload, setPayload ] = useState([]);

    var [ filters, setFilters ] = (
        target === 'table'
        ? useURLSearchParamsB64()
        : useState({})
    );
    var sorter = (
        target === 'table'
        ? useSortURLSearchParams()
        : useSortReducer({})
    );
    var { sortPath, sortDirection } = sorter;

    var [ didChangeFilters, setDidChangeFilters ] = useState(false);
    //var [ cachedOffset, setCachedOffset ] = useState(0);

    var pagination = (
        target === 'table'
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

        console.log({ collection, recordType });

        var commonPayload = {
            target,
            searchOptions,

            offset: didChangeFilters ? 0 : offset,
            limit,
            constraints,
            extraIds,
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
        }

        var promise = undefined;
        if ([
            'study',
            'helperSet', 'helperSetItem'
        ].includes(collection)) {
            promise = agent.fetch(`/${collection}/list`, {
                ...commonPayload,
                ...(recordType && { recordType }),
            });
        }
        else {
            promise = agent.searchRecords({
                ...commonPayload, collection, recordType
            });
        }

        return promise.then((response) => {
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
        relatedCustomRecordTypes
    } = fetched.data;
  
    return (
        <>
            <div className='sticky-top border-bottom'>
                <div className='d-flex justify-content-between bg-light border-bottom'>
                    <QuickSearch
                        target={ target }
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
                            if (target !== 'table') {
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
                                { translate('Show Hidden') }
                            </span>
                        </div>
                    </div>
                </div>
                <Pagination
                    { ...pagination }
                    showJump={ target === 'table' }
                />
            </div>

            <Table { ...({
                className: tableClassName,

                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypes,

                enableView,
                enableEdit_old,
                enableRecordRowLink,

                enableSelectRecords,
                showSelectionIndicator,
                onSelectRecord,
                selectedRecordIds,

                canSort,
                sorter,

                linkBaseUrl,
                bsTableProps,
                CustomActionListComponent,
            })} />
        </>
    )
}





export default RecordList;
