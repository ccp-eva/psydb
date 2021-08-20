import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

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
}) => (
    <Switch>
         <Route exact path={`${path}`}>
            <RecordList
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }
                enableView={ true }
                enableNew={ true }
                enableEdit={ true }
            />
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

        <Route
            exact path={`${path}/:id`}
            render={ (ps) => (
                <Redirect to={
                    `${url}/${ps.match.params.id}/details`
                } />
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
    </Switch>
);

export default RecordTypeRouting;
