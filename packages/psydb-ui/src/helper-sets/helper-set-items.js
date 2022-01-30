import React, { useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    useParams,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import { useReadRecord } from '@mpieva/psydb-ui-hooks';

import {
    LinkButton,
    LoadingIndicator,
    LinkContainer,
    Icons
} from '@mpieva/psydb-ui-layout';

import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

import { RecordCreator, RecordEditor } from './items';

const HelperSetItems = () => {
    var { path, url } = useRouteMatch();
    var { setId } = useParams();
    var history = useHistory();

    var [ didFetch, fetched ] = useReadRecord({
        collection: 'helperSet',
        id: setId,
        shouldFetchSchema: false,
        shouldFetchFieldDefinitions: false,
    });

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { record } = fetched;

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
                    <RecordCreator
                        collection='helperSetItem'
                        setId={ setId }
                        onSuccessfulUpdate={ ({ id }) => {
                            history.push(`${url}`)
                        }}
                    />
                </Route>

                <Route path={`${path}/:id/edit`}>
                    <RecordEditor
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
                <Icons.PencilFill style={{ width: '20px', marginTop: '-3px' }} />
            </LinkButton>
        </>
    )
}

export default HelperSetItems;
