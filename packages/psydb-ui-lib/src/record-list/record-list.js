import React, { useState, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';

import Table from './table';

var RecordList = ({
    collection,
    recordType,
    offset,
    limit,
    filters,

    displayFields,

    enableView,
    enableEdit,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,
    
    linkBaseUrl
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ payload, setPayload ] = useState([]);

    useEffect(() => (
        agent.searchRecords({
            collection,
            recordType,
            offset,
            limit,
            filters,
        })
        .then((response) => {
            console.log(response);
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
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels
    } = payload;
  
    return (
        <Table { ...({
            records,
            displayFieldData,
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,

            enableView,
            enableEdit,

            enableSelectRecords,
            showSelectionIndicator,
            onSelectRecord,
            selectedRecordIds,

            linkBaseUrl
        })} />
    )
}





export default RecordList;
