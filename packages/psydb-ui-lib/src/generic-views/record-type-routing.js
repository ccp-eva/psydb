import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

const RecordTypeRouting = (ps) => {
    var {
        collection,
        recordType,

        url,
        path,
        history,

        RecordList,
        RecordDetails: RecordDetailsOrEditor,
        RecordCreator,
        RecordEditor,
        RecordRemover,
        RecordAnonymizer,
    } = ps;

    return <Switch>
         <Route exact path={`${path}`}>
            <RecordList
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }
                enableView={ false }
                enableNew={ true }
                enableEdit={ false }
                enableRecordRowLink={ true }
                canSort={ true }
            />
        </Route>

        <Route exact path={`${path}/new`}>
            <RecordCreator
                type='create'
                collection={ collection }
                recordType={ recordType }
                onSuccessfulUpdate={ (bag = {}) => {
                    var { id } = bag;
                    return history.push(id ? `${url}/${id}` : url)
                }}
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
            <RecordDetailsOrEditor
                collection={ collection }
                recordType={ recordType }
                removeUrl={ `${url}/:id/remove` }
                onSuccessfulUpdate={ (bag = {}) => {
                    var { id } = bag;
                    return history.push(id ? `${url}/${id}` : url)
                }}
            />
        </Route>

        <Route path={`${path}/:id/edit`}>
            <RecordEditor
                type='edit'
                collection={ collection }
                recordType={ recordType }
                removeUrl={ `${url}/:id/remove` }
                onSuccessfulUpdate={ (bag = {}) => {
                    var { id } = bag;
                    return history.push(id ? `${url}/${id}` : url)
                }}
            />
        </Route>
        
        { RecordRemover && (
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
        )}
        { RecordAnonymizer && (
            <Route path={`${path}/:id/clean-gdpr`}>
                <RecordAnonymizer
                    collection={ collection }
                    recordType={ recordType }
                    successInfoBackLink={ `#${url}` }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}/${id}/clean-gdpr/success`)
                    }}
                />
            </Route>
        )}
    </Switch>
};

export default RecordTypeRouting;
