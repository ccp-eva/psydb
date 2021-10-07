import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { LinkContainer } from 'react-router-bootstrap';

import RecordListContainer from './record-list-container';
import GenericRecordDetailsContainer from './generic-record-details-container';
import GenericRecordFormContainer from './generic-record-form-container';

const GenericRecordTypeView = ({
    customRecordTypes,
    collection,

    noSpacer,

    CustomRoutingComponent,
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
                <LinkContainer to={ url }>
                    <h5 className='mt-0 mb-3 text-muted' role='button'>
                        Typ: { typeData.state.label }
                    </h5>
                </LinkContainer>
            )}
            { (!recordType && !noSpacer) && (
                <div className='mb-3'></div>
            )}


            { 
                CustomRoutingComponent
                ? (
                    <CustomRoutingComponent { ...({
                        path,
                        url,
                        collection,
                        recordType,
                    }) } />
                )
                : (
                    <DefaultRouting { ...({
                        path,
                        url,
                        collection,
                        recordType,
                    }) } />
                )
            }

        </div>
    );
}

const DefaultRouting = ({
    path,
    url,

    collection,
    recordType
}) => {
    var history = useHistory();
    return (
        <Switch>
            <Route exact path={`${path}`}>
                <RecordListContainer
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
                    enableView={ true }
                    enableNew={ true }
                />
            </Route>

            <Route exact path={`${path}/new`}>
                <GenericRecordFormContainer
                    type='create'
                    collection={ collection }
                    recordType={ recordType }
                    onSuccessfulUpdate={
                        ({ id }) => history.push(`${url}/${id}`)
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
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}/${id}`)
                    }}
                />
            </Route>

        </Switch>
    )
}

export default GenericRecordTypeView;
