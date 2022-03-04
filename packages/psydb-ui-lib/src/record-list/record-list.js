import React, { useState, useEffect } from 'react';

import {
    useFetch,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import QuickSearch from '../quick-search';
import Table from './table';

var RecordList = ({
    target,
    collection,
    recordType,
    constraints,
    searchOptions,

    //offset,
    //limit,
    //filters,
    defaultSort,

    enableView,
    enableEdit_old,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,

    useURLSearchParams,

    linkBaseUrl,
    tableClassName,
    bsTableProps,
    CustomActionListComponent,
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ payload, setPayload ] = useState([]);

    var [ filters, setFilters ] = useState({});
    var [ didChangeFilters, setDidChangeFilters ] = useState(false);
    //var [ cachedOffset, setCachedOffset ] = useState(0);

    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    // FIXME: this renders twice; we need to
    // add function to set Offset manually in pagination hook
    // and then use the flag below as dependency in effect
    // var didOffsetChange = ( offset !== cachedOffset );
    var [ didFetch, fetched ] = useFetch((agent) => {
        if (didChangeFilters) {
            pagination.selectSpecificPage(0);
        }

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
            filters,
            sort: defaultSort || undefined
        })
        .then((response) => {
            setDidChangeFilters(false);
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        });
    }, [ collection, recordType, offset, limit, filters, searchOptions ]);

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
                <QuickSearch
                    filters={ filters }
                    displayFieldData={ displayFieldData }
                    onSubmit={ ({ filters }) => {
                        setDidChangeFilters(true);
                        setFilters(filters);
                    }}
                />
                <Pagination { ...pagination } />
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

                enableSelectRecords,
                showSelectionIndicator,
                onSelectRecord,
                selectedRecordIds,

                linkBaseUrl,
                bsTableProps,
                CustomActionListComponent,
            })} />
        </>
    )
}





export default RecordList;
