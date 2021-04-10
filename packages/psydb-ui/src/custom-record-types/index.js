import React, { useState, useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import {
    Route,
    Switch,
    useRouteMatch
} from 'react-router-dom';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { NewRecordForm } from '@mpieva/psydb-ui-lib';

const CustomRecordTypes = () => {
    var { path, url } = useRouteMatch();

    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    Datensatz-Typen
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <ListContainer collection='customRecordType' />
                </Route>
                <Route path={`${path}/new`}>
                    <NewRecordForm collection='customRecordType' />
                </Route>
            </Switch>
        </div>
    )
}

const ListContainer = ({
    collection,
    recordType,
}) => {
    var { path, url } = useRouteMatch();

    return (
        <>
        <LinkContainer to={`${path}/new`}>
            <Button>Neuer Eintrag</Button>
        </LinkContainer>
        <List collection={ collection } recordType={ recordType } />
        </>
    );
}

var List = ({
    collection,
    recordType,
    offset,
    limit,
    filters,
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
            setRecords(response.data.records);
            setIsInitialized(true);
        })
    ), [ collection, recordType, offset, limit, filters ])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            List
        </div>
    );
}

    /*const NewRecordForm = () => (
    <div>
        AAAAAAAAAAAAAAAAAA
    </div>
);*/

export default CustomRecordTypes;
