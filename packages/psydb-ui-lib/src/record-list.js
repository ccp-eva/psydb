import React, { useState, useEffect } from 'react';
import jsonpointer from 'jsonpointer';

import {
    Table
} from 'react-bootstrap';

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

    return (
        <Table hover={ onSelectRecord ? true : false }>
            <TableHead displayFieldData={ payload.displayFieldData } />
            <TableBody
                records={ payload.records }
                displayFieldData={ payload.displayFieldData }
                
                enableView={ enableView }
                enableEdit={ enableEdit }
                onSelectRecord={ onSelectRecord }

                linkBaseUrl={ linkBaseUrl }
            />
        </Table>
    );
}

const TableHead = ({
    displayFieldData,
}) => {
    return (
        <thead>
            <tr>
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
    onSelectRecord,
    
    linkBaseUrl,
}) => {
    return (
        <tbody>
            { records.map(it => (
                <TableRow
                    key={ it._id }
                    record={ it }
                    displayFieldData={ displayFieldData }
                    enableView={ enableView }
                    enableEdit={ enableEdit }
                    onSelectRecord={ onSelectRecord }
                    linkBaseUrl={ linkBaseUrl }
                />
            )) }
        </tbody>
    )
}

const TableRow = ({
    displayFieldData,
    record,
    
    enableView,
    enableEdit,
    onSelectRecord,
    linkBaseUrl,
}) => {
    return (
        <tr onClick={ onSelectRecord && (() => onSelectRecord(record)) }>
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
