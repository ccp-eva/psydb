import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import { LinkContainer } from '@mpieva/psydb-ui-layout';
import ExtendedSearch from './extended-search';

const RecordTypeRouting = ({
    collection,
    recordType,

    url,
    path,
    history,

    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,
    RecordRemover,
}) => (
    <Switch>
        <Route exact path={`${path}`}>
            <>
                <div className='media-print-hidden'>
                    <LinkContainer to={ `${url}/extended-search/` }>
                        <a>Erweiterte Search</a>
                    </LinkContainer>
                </div>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
                    enableView={ true }
                    enableNew={ true }
                    enableEdit={ true }
                />
            </>
        </Route>

        <Route exact path={`${path}/new`}>
            <RecordCreator
                type='create'
                collection={ collection }
                recordType={ recordType }
                onSuccessfulUpdate={
                    ({ id }) => history.push(`${url}/${id}`)
                }
            />
        </Route>

        <Route path={`${path}/extended-search/`}>
            <ExtendedSearch {...({
                collection,
                recordType
            })} />
        </Route>

        <Route
            exact path={`${path}/:id`}
            render={ (ps) => (
                <Redirect to={ `${url}/${ps.match.params.id}/details` } />
            )}
        />

        <Route path={`${path}/:id/details`}>
            <RecordDetails
                collection={ collection }
                recordType={ recordType }
            />
        </Route>

        <Route path={`${path}/:id/edit`}>
            <RecordEditor
                type='edit'
                collection={ collection }
                recordType={ recordType }
                onSuccessfulUpdate={ ({ id }) => {
                    history.push(`${url}/${id}`)
                }}
            />
        </Route>
        
        <Route path={`${path}/:id/remove`}>
            <RecordRemover
                type='edit'
                collection={ collection }
                recordType={ recordType }
                successInfoBackLink={ `#${url}` }
                onSuccessfulUpdate={ ({ id }) => {
                    history.push(`${url}/${id}/remove/success`)
                }}
            />
        </Route>
    </Switch>
);

export default RecordTypeRouting;
