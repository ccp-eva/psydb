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
    var pagination = usePaginationReducer({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.searchRecords({
            target,
            collection,
            recordType,
            searchOptions,
            offset,
            limit,
            constraints,
            filters,
            sort: defaultSort || undefined
        })
        .then((response) => {
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
            <QuickSearch
                filters={ filters }
                displayFieldData={ displayFieldData }
                onSubmit={ ({ filters }) => setFilters(filters) }
            />
            <Pagination { ...pagination } />

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
