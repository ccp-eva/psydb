import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';


const EditType = ({}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ record, setRecord ] = useState([]);

    useEffect(() => (
        agent.get(`/api/read/customRecordType/${id}`)
        .then((response) => {
            console.log(response);
            setRecord(response.data.data.record);
            setIsInitialized(true);
        })
    ), [ id ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var fieldData = gatherFieldData({
        customRecordTypeData: record,
    });

    console.log(fieldData);

    return (
        <div>
            <div>
                { record.collection } { record.type }
            </div>
            <hr />
            <div>
                Anzeigename: { record.state.label } 
            </div>
        </div>
    )
}

const DisplayFieldsList = ({ items, fieldDataByPointer }) => {
    return (
        <div>
            { items.map(it => (
                <div>
                </div>
            )) }
        </div>
    );
}

export default EditType;
