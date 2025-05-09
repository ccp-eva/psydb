import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import { LinkContainer } from '@mpieva/psydb-ui-layout';
import ExtendedSearch from './extended-search';
import DuplicatesRouting from './duplicates';

const RecordTypeRouting = ({
    collection,
    recordType,

    url,
    path,
    history,

    RecordList,
    RecordDetails,
    RecordHistory,
    RecordCreator,
    RecordEditor,
    RecordRemover,
}) => (
    <Switch>
        <Route exact path={`${path}`}>
            <>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
                    enableView={ false }
                    enableDuplicatesSearch={ true }
                    enableExtendedSearch={ true }
                    enableCSVExport={ true }
                    enableNew={ true }
                    enableEdit={ false }
                    enableRecordRowLink={ true }
                    canSort={ true }
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

        <Route path={`${path}/duplicates`}>
            <DuplicatesRouting recordType={ recordType } />
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

        <Route path={`${path}/:id/channel-history`}>
            <RecordHistory
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
