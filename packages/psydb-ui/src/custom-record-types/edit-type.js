import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

import createSchemaForRecordType from '@mpieva/psydb-common-lib/src/create-schema-for-record-type';


const EditType = ({}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ record, setRecord ] = useState([]);

    useEffect(() => (
        agent.get(`/api/read/customRecordType/${id}`)
        .then((response) => {
            var record = response.data.data.record;
            var schema = createSchemaForRecordType({
                collectionName: record.collection,
                customRecordTypeCollection: record.type,
                prefetchedCustomRecordTypes: [ record ]
            });
            console.log(record);
            console.log(schema);
            setRecord(response.data.data.record);
            setIsInitialized(true);
        })
    ), [ id ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

        /*var fieldData = gatherFieldData({
        customRecordTypeData: record,
    });

    console.log(fieldData);*/

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
