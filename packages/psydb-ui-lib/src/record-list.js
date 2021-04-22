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
import LinkButton from './link-button';

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

    console.log(payload);

    if (!payload.records) {
        return (
            <div>Empty</div> 
        );
    }

    var wrappedOnSelectRecord = (record) => {
        if (!onSelectRecord) {
            return
        }

        var action = (
            selectedRecordIds.includes(record._id)
            ? ({ type: 'remove', payload: { id: record._id } })
            : ({ type: 'add', payload: { id: record._id } })
        );

        return onSelectRecord(action);
    }

    return (
        <Table hover={ onSelectRecord ? true : false }>
            <TableHead
                displayFieldData={ payload.displayFieldData }
                showSelectionIndicator={ showSelectionIndicator }
            />
            <TableBody { ...({
                records: payload.records,
                displayFieldData: payload.displayFieldData,

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

const TableHead = ({
    displayFieldData,
    showSelectionIndicator,
}) => {
    return (
        <thead>
            <tr>
                { showSelectionIndicator && (
                    <th></th>
                )}
                { displayFieldData.map(it => (
                    <th key={ it.key }>{ it.displayName }</th>
                ))}
                <th></th>
            </tr>
        </thead>
    );
}

const TableBody = ({
    displayFieldData,
    records,

    enableView,
    enableEdit,
    
    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,
    
    linkBaseUrl,
}) => {
    return (
        <tbody>
            { records.map(it => (
                <TableRow { ...({
                    key: it._id,
                    record: it,

                    displayFieldData,
                    enableView,
                    enableEdit,
                    linkBaseUrl,
                
                    enableSelectRecord,
                    showSelectionIndicator,
                    onSelectRecord,
                    selectedRecordIds,
                })} />
            )) }
        </tbody>
    )
}

const TableRow = ({
    displayFieldData,
    record,
    
    enableView,
    enableEdit,

    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,

    linkBaseUrl,
}) => {
    return (
        <tr onClick={ onSelectRecord && (() => onSelectRecord(record)) }>
            { showSelectionIndicator && (
                <td>
                    {
                        selectedRecordIds.includes(record._id)
                        ? <CheckSquareFill />
                        : <Square />
                    }
                </td>
            )}
            { displayFieldData.map(it => {
                var rawValue = jsonpointer.get(record, it.dataPointer);
                // TODO use stringifiers from common
                return (
                    <td key={ it.key }>{ String(rawValue) }</td>
                );
            })}
            <td>
                { enableEdit && (
                    <LinkButton to={`${linkBaseUrl}/${record._id}/edit`}>
                        Edit
                    </LinkButton>
                )}
            </td>
        </tr>
    );
}

export default RecordList;
