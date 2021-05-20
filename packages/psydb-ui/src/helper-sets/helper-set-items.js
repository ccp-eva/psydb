import React from 'react';
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

import GenericCollectionView from '@mpieva/psydb-ui-lib/src/generic-collection-view';
import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';



const HelperSetItems = () => {
    var { path, url } = useRouteMatch();
    var { setId } = useParams();
    var history = useHistory();

    return (
        <>
            <LinkContainer to={ url }>
                <h2 className='m-0 border-bottom'>
                    FOO
                </h2>
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

export default HelperSetItems;
