import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import RecordListContainer from './record-list-container';
import GenericRecordDetailsContainer from './generic-record-details-container';
import GenericRecordFormContainer from './generic-record-form-container';

const GenericRecordTypeView = ({
    customRecordTypes,
    collection,
}) => {
    var { path, url } = useRouteMatch();
    var { recordType } = useParams();

    var typeData = undefined;
    if (recordType) {
        typeData = customRecordTypes.find(it => (
            (it.type === recordType)
            && it.collection === collection
        ));
    }

    return (
        <div>
            { recordType && (
                <h5 className='mt-0 mb-3 text-muted'>
                    Typ: { typeData.state.label }
                </h5>
            )}
            <Switch>
                <Route exact path={`${path}`}>
                    <RecordListContainer
                        linkBaseUrl={ url }
                        collection={ collection }
                        recordType={ recordType }
                        enableView={ true }
                        enableNew={ true }
                        enableEdit={ true }
                    />
                </Route>
                <Route exact path={`${path}/new`}>
                    <GenericRecordFormContainer
                        type='create'
                        collection={ collection }
                        recordType={ recordType }
                        onCreated={
                            ({ id }) => history.push(`${url}/${id}/edit`)
                        }
                    />
                </Route>

                <Route exact path={`${path}/:id`}>
                    <GenericRecordDetailsContainer
                        collection={ collection }
                        recordType={ recordType }
                    />
                </Route>

                <Route path={`${path}/:id/edit`}>
                    <GenericRecordFormContainer
                        type='edit'
                        collection={ collection }
                        recordType={ recordType }
                        onUpdated={ ({ id }) => {
                            //history.push(`${url}`)
                        }}
                    />
                </Route>
            </Switch>
        </div>
    );
}

export default GenericRecordTypeView;
