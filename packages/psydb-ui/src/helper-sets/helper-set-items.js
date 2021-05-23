import React, { useEffect, useReducer } from 'react';
import { PencilFill } from 'react-bootstrap-icons';

import {
    Route,
    Switch,
    useParams,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import {
    LinkContainer
} from 'react-router-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';

import GenericCollectionView from '@mpieva/psydb-ui-lib/src/generic-collection-view';
import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';


const HelperSetItems = () => {
    var { path, url } = useRouteMatch();
    var { setId } = useParams();
    var history = useHistory();

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        record
    } = state;

    useEffect(() => {
        agent.readRecord({
            collection: 'helperSet',
            id: setId
        })
        .then((response) => {
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })
    }, [ setId ])

    if (!record) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    Tabelle: { record._recordLabel }
                </h5>
            </LinkContainer>

            <Switch>
            
                <Route exact path={`${path}`}>
                    <RecordListContainer
                        linkBaseUrl={ url }
                        collection='helperSetItem'
                        enableNew={ true }
                        constraints={{
                            '/setId': setId
                        }}
                        CustomActionListComponent={
                            HelperSetItemRecordActions
                        }
                    />
                </Route>

                <Route path={`${path}/new`}>
                    <GenericRecordFormContainer
                        type='create'
                        collection='helperSetItem'
                        additionalPayloadProps={{
                            setId,
                        }}
                        onSuccessfulUpdate={ ({ id }) => {
                            history.push(`${url}`)
                        }}
                    />
                </Route>

                <Route path={`${path}/:id/edit`}>
                    <GenericRecordFormContainer
                        type='edit'
                        collection='helperSetItem'
                        onSuccessfulUpdate={ ({ id }) => {
                            history.push(`${url}`)
                        }}
                    />
                </Route>

            </Switch>
        </>
    );
}

const HelperSetItemRecordActions = ({
    linkBaseUrl,
    record,
}) => {
    return (
        <>
            <LinkButton
                size='sm'
                variant='outline-primary'
                to={ `${linkBaseUrl}/${record._id}/edit`}
            >
                <PencilFill style={{ width: '20px', marginTop: '-3px' }} />
            </LinkButton>
        </>
    )
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return {
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            }
    }
}

export default HelperSetItems;
