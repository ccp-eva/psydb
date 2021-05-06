import React, { useState, useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { LinkButton } from '@mpieva/psydb-ui-lib';

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
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
                    <RecordListContainer
                        linkBaseUrl={ url }
                        collection='customRecordType'
                        enableNew={ true }
                        enableEdit_old={ true }
                    />
                </Route>
                <Route path={`${path}/new`}>
                    <CreateNewType onCreated={
                        ({ id }) => history.push(`${path}/${id}/edit`)
                    } />
                </Route>
                <Route path={`${path}/:id/edit`}>
                    <CustomRecordTypeEditor />
                </Route>
            </Switch>
        </div>
    )
}

export default CustomRecordTypes;
