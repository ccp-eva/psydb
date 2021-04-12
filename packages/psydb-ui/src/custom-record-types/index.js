import React, { useState, useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import CreateNewType from './create-new-type';
import CustomRecordTypeEditor from './edit';

const CustomRecordTypes = () => {
    var { path, url } = useRouteMatch();
    var history =  useHistory();

    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    Datensatz-Typen
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <ListContainer
                        linkBasePath={ path }
                        collection='customRecordType'
                    />
                </Route>
                <Route path={`${path}/new`}>
                    <CreateNewType onCreated={
                        ({ id }) => history.push(`${path}/${id}/edit`)
                    } />
                </Route>
                <Route path={`${path}/:id`}>
                    <CustomRecordTypeEditor />
                </Route>
            </Switch>
        </div>
    )
}

const ListContainer = ({
    collection,
    recordType,
    linkBasePath,

    enableView,
    enableEdit,
}) => {
    var { path, url } = useRouteMatch();

    return (
        <>
        <LinkContainer to={`${path}/new`}>
            <Button>Neuer Eintrag</Button>
        </LinkContainer>
        <List
            linkBasePath={ linkBasePath }
            collection={ collection }
            recordType={ recordType }
        />
        </>
    );
}

var List = ({
    collection,
    recordType,
    offset,
    limit,
    filters,

    enableView,
    enableEdit,
    linkBasePath
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ records, setRecords ] = useState([]);

    useEffect(() => (
        agent.post('/api/search', {
            collectionName: collection,
            recordType,
            offset: 0,
            limit: 50,
            filters: {}
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
        <div>
            { records.map(it => (
                <div key={ it._id }>
                    { it.collection }
                    {' '}
                    { it.type }
                    <LinkContainer to={`${linkBasePath}/${it._id}`}>
                        <Button>Edit</Button>
                    </LinkContainer>
                </div>
            )) }
        </div>
    );
}

    /*const NewRecordForm = () => (
    <div>
        AAAAAAAAAAAAAAAAAA
    </div>
);*/

export default CustomRecordTypes;
