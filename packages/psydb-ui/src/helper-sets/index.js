import React from 'react';
import { PencilFill, List } from 'react-bootstrap-icons';

import GenericCollectionView from '@mpieva/psydb-ui-lib/src/generic-collection-view';
import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';

import {
    Route,
    Switch,
    useParams,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

const HelperSets = () => {
    return (
        <GenericCollectionView
            collection='helperSet'
            CustomRoutingComponent={ HelperSetRouting }
        />
    );
}

const HelperSetRouting = ({
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
                    enableNew={ true }
                    CustomActionListComponent={ HelperSetRecordActions }
                />
            </Route>

            <Route path={ `${path}/:id/items` }>
                <div>FOO</div>
            </Route>
            
            <Route path={`${path}/:id/edit`}>
                <GenericRecordFormContainer
                    type='edit'
                    collection={ collection }
                    recordType={ recordType }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}`)
                    }}
                />
            </Route>

        </Switch>
    )
}

const HelperSetRecordActions = ({
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
            <LinkButton
                className='ml-2'
                size='sm'
                variant='outline-primary'
                to={ `${linkBaseUrl}/${record._id}/items`}
            >
                <List style={{ height: '20px', width: '20px', marginTop: '-3px' }} />
            </LinkButton>
        </>
    )
}


export default HelperSets;
