import React, { useState, useEffect, useReducer, useCallback } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import {
    Alert,
    LinkButton,
    LoadingIndicator,
    TabNav,
} from '@mpieva/psydb-ui-layout';

//import createSchemaForRecordType from '@mpieva/psydb-common-lib/src/create-schema-for-record-type';

import LiveDataEditor from './live-data-editor';
import FieldEditor from './field-editor';

const EditType = ({}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        record
    } = state;

    var fetchRecord = useCallback(() => {
        agent.readRecord({
            collection: 'customRecordType',
            id,
        })
        .then((response) => {
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })
    }, [ id ])

    var handleSuccessfulUpdate = () => {
        fetchRecord();
    }

    useEffect(() => {
        fetchRecord();
    }, [ id ]);

    if (!record) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <div>
            <h5 className='mt-0 mb-3 text-muted'>
                Typ: { record.state.label }
            </h5>

            <div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>Collection</div>
                    <div><b>{ record.collection }</b></div>
                </div>
                <div className='d-flex'>
                    <div style={{ width: '25%'}}>Interner Type-Key</div>
                    <div><b>{ record.type }</b></div>
                </div>
            </div>

            { record.state.isNew && (
                <div>NEW RECORD TYPE</div>
            )}
            { record.state.isDirty && (
                <DirtyAlert />
            )}
            
            <hr />

            <Switch>
                <Route exact path={`${path}`}>
                    <Redirect to={`${url}/live`} />
                </Route>
                <Route path={ `${path}/:tabKey` }>
                    <EditTypePanel { ...({
                        id,
                        record,
                        onSuccessfulUpdate: handleSuccessfulUpdate
                    }) } />
                </Route>
        </Switch>
        </div>
    )
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return {
                ...state,
                record: payload.record,
                //relatedRecordLabels: payload.relatedRecordLabels,
                //relatedHelperSetItems: payload.relatedHelperSetItems,
                //relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            }
    }
}

const EditTypePanel = ({
    id,
    record,
    onSuccessfulUpdate
}) => {
    var { path, url } = useRouteMatch();
    var { tabKey } = useParams();
    var history = useHistory();
    
    var onEdited = (...args) => {
        console.log(args);
    }

    var content = (
        tabKey === 'fields'
        ? (
            <FieldEditor
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        )
        : (
            <LiveDataEditor
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        )
    )

    return (
        <div>
            <TabNav
                className='d-flex'
                itemClassName='flex-grow'
                activeKey={ tabKey }
                onItemClick={ (key) => {
                    history.push(`${up(url, 1)}/${key}`);
                }}
                items={[
                    { key: 'live', label: 'Live-Settings' },
                    { key: 'fields', label: 'Feld-Editor' },
                ]}
            />
            
            <div className='p-3 border-left border-bottom border-right'>
                { content }
            </div>

        </div>
    )
}

const DirtyAlert = ({}) => {
    return (
        <div className='text-danger small mt-3'>
            <header><b>Unfixierte Felder</b></header>
            <div>
                Datensatz-Typ enthält noch unfixierte Feldänderungen,
                bevor diese in den Live-Settings und in den Datensätzen
                verfügbar sind müssen sie vorher im Feld-Editor fixiert werden.
            </div>
        </div>
    );
}

export default EditType;
