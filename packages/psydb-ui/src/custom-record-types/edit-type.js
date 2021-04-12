import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

//import createSchemaForRecordType from '@mpieva/psydb-common-lib/src/create-schema-for-record-type';


import { LinkButton } from '@mpieva/psydb-ui-lib';

import LiveDataEditor from './live-data-editor';
import FieldEditor from './field-editor';

const EditType = ({}) => {
    var { path, url } = useRouteMatch();
    console.log(path, url);
    var { id } = useParams();
    
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ record, setRecord ] = useState([]);

    useEffect(() => (
        agent.get(`/api/read/customRecordType/${id}`)
        .then((response) => {
            var record = response.data.data.record;

            /*var schema = createSchemaForRecordType({
                collectionName: record.collection,
                customRecordTypeCollection: record.type,
                prefetchedCustomRecordTypes: [ record ]
            });*/

            console.log(record);
            setRecord(response.data.data.record);
            setIsInitialized(true);
        })
    ), [ id ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var onEdited = (...args) => {
        console.log(args);
    }

    return (
        <div>
            { record.state.isNew && (
                <div>NEW RECORD TYPE</div>
            )}
            <div>
                { record.collection } { record.type }
            </div>
            <hr />
            <div>
                <LinkButton to={`${url}/live`}>
                    Live Settings
                </LinkButton>
                <LinkButton to={`${url}/fields`}>
                    Fields
                </LinkButton>
            </div>
            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${url}/live`} />
                </Route>
                <Route exact path={`${path}/live`}>
                    <LiveDataEditor
                        record={ record }
                        onEdited={ onEdited }
                    />
                </Route>
                <Route path={`${path}/fields`}>
                    <FieldEditor
                        record={ record }
                        onEdited={ onEdited }
                    />
                </Route>
            </Switch>
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
