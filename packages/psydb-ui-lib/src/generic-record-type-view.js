import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import RecordListContainer from './record-list-container';
import GenericRecordForm from './generic-record-form';

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
                        enableNew={ true }
                        enableEdit={ true }
                    />
                </Route>
                <Route path={`${path}/new`}>
                    <GenericRecordForm
                        type='create'
                        collection={ collection }
                        recordType={ recordType }
                        onCreated={
                            ({ id }) => history.push(`${url}/${id}/edit`)
                        }
                    />
                </Route>
                <Route path={`${path}/:id/edit`}>
                    <GenericRecordForm
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
