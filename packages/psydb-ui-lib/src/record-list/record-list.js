import React, { useState, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';

import usePaginationReducer from '../use-pagination-reducer';
import Pagination from '../pagination';
import QuickSearch from '../quick-search';
import Table from './table';

var RecordList = ({
    collection,
    recordType,
    //offset,
    //limit,
    constraints,
    //filters,

    displayFields,

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

    useEffect(() => (
        agent.searchRecords({
            collection,
            recordType,
            offset,
            limit,
            constraints,
            filters,
        })
        .then((response) => {
            //console.log(response);
            pagination.setTotal(response.data.data.recordsCount);
            setPayload(response.data.data);
            setIsInitialized(true);
        })
    ), [ collection, recordType, offset, limit, filters ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var {
        records,
        recordsCount,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels
    } = payload;
  
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
