import React, { useState, useEffect } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { LinkContainer, LinkButton } from '@mpieva/psydb-ui-layout';

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import CreateNewType from './create-new-type';
import EditType from './edit';

const EditButton = (ps) => {
    var { linkBaseUrl, record } = ps;
    return (
        <LinkButton
            size='sm'
            to={`${linkBaseUrl}/${record._id}/edit`}>
            Bearbeiten
        </LinkButton>
    )
}

const CustomRecordTypes = () => {
    var { path, url } = useRouteMatch();
    var history =  useHistory();

    return (
        <div>
            <header>
                <LinkContainer to={ url }>
                    <h1 className='border-bottom mb-0' role='button'>
                        Datensatz-Typen
                    </h1>
                </LinkContainer>
            </header>

            <Switch>
                <Route exact path={`${path}`}>
                    <div className='mt-3'>
                        <RecordListContainer
                            linkBaseUrl={ url }
                            collection='customRecordType'
                            enableNew={ true }
                            defaultSort={{
                                path: 'state.label',
                                direction: 'asc',
                            }}

                            CustomActionListComponent={ EditButton }
                        />
                    </div>
                </Route>
                <Route path={`${path}/new`}>
                    <div className='mt-3'>
                        <CreateNewType onCreated={
                            ({ id }) => history.push(`${path}/${id}/edit`)
                        } />
                    </div>
                </Route>
                <Route path={`${path}/:id/edit`}>
                    <EditType />
                </Route>
            </Switch>
        </div>
    )
}

export default CustomRecordTypes;
