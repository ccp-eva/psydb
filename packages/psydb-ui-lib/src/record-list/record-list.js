import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    Table
} from 'react-bootstrap';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import agent from '@mpieva/psydb-ui-request-agents';
import LinkButton from '../link-button';

import TableHead from './table-head';
import TableBody from './table-body';

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
        relatedRecords,
        relatedHelperSetItems
    } = payload;
   
    if (!records) {
        return (
            <div>Empty</div> 
        );
    }

    var wrappedOnSelectRecord = (record) => {
        if (!onSelectRecord) {
            return
        }

        if (selectedRecordIds) {
            var action = (
                selectedRecordIds.includes(record._id)
                ? ({ type: 'remove', payload: { id: record._id } })
                : ({ type: 'add', payload: { id: record._id } })
            );
            return onSelectRecord(action);
        }
        else {
            return onSelectRecord(record);
        }
    }

    return (
        <Table hover={ onSelectRecord ? true : false }>
            <TableHead
                displayFieldData={ displayFieldData }
                showSelectionIndicator={ showSelectionIndicator }
            />
            <TableBody { ...({
                records,
                displayFieldData,
                relatedRecords,
                relatedHelperSetItems,

                enableView,
                enableEdit,

                enableSelectRecords,
                showSelectionIndicator,
                onSelectRecord: wrappedOnSelectRecord,
                selectedRecordIds,

                linkBaseUrl
            })} />
        </Table>
    );
}





export default RecordList;
