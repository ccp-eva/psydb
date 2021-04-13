import React, { useState, useEffect } from 'react';

import {
    Table
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import { LinkButton } from '@mpieva/psydb-ui-lib';

var RecordList = ({
    collection,
    recordType,
    offset,
    limit,
    filters,

    displayFields,

    enableView,
    enableEdit,
    linkBaseUrl
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ payload, setPayload ] = useState([]);

    useEffect(() => (
        agent.post('/api/search', {
            collectionName: collection,
            recordType,
            offset: offset || 0,
            limit: offset || 50,
            filters: filters || {}
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
        <Table>
            <TableHead displayFieldData={ payload.displayFieldData } />
            <tbody>
                { payload.records.map(it => (
                    <tr key={ it._id }>
                        <td>{ it.collection }</td>
                        <td>{ it.state.label }</td>
                        <td>
                            <LinkButton to={`${linkBaseUrl}/${it._id}`}>
                                Edit
                            </LinkButton>
                        </td>
                    </tr>
                )) }
            </tbody>
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

export default RecordList;
