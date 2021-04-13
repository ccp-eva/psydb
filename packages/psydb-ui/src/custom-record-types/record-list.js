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
    var [ records, setRecords ] = useState([]);

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
            setRecords(response.data.data.records);
            setIsInitialized(true);
        })
    ), [ collection, recordType, offset, limit, filters ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    console.log(records);

    if (!records) {
        return (
            <div>Empty</div> 
        );
    }

    return (
        <Table>
            <tbody>
                { records.map(it => (
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

export default RecordList;
