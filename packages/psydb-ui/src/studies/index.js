import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    usePermissions,
    useFetch,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    LinkContainer,
    PermissionDenied
} from '@mpieva/psydb-ui-layout';

import {
    RedirectOrTypeNav,
    RecordListContainer
} from '@mpieva/psydb-ui-lib';

import allSchemaCreators from '@mpieva/psydb-schema-creators';

import StudyRecordTypeView from './record-type-view';

// TODO: put this somewhere
var collectionDisplayNames = {
    'location': 'Locations',
    'subject': 'Probanden',
    'study': 'Studien',
    'researchGroup': 'Forschungsgruppen',
    'personnel': 'Mitarbeiter',
    'systemRole': 'System-Rollen',
}

const GenericCollectionView = () => {
    var collection = 'study';
    var { path, url } = useRouteMatch();
    
    var permissions = usePermissions();
    var canRead = permissions.hasFlag('canReadStudies');
    if (!canRead) {
        return (
            <>
                <LinkContainer to={ url }>
                    <h1 className='m-0 border-bottom' role='button'>
                        { collectionDisplayNames[collection] || collection }
                    </h1>
                </LinkContainer>
                <div className='mt-3'>
                    <PermissionDenied />
                </div>
            </>
        )
    }

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var collectionRecordTypes = fetched.data;

    var { hasCustomTypes } = allSchemaCreators[collection];

    // TODO: static types
    return (
        <div>
            <header>
                <LinkContainer to={ url }>
                    <h1 className='m-0 border-bottom' role='button'>
                        { collectionDisplayNames[collection] || collection }
                    </h1>
                </LinkContainer>
            </header>
            {(
                hasCustomTypes
                ? (
                    <RoutingForCustomTypes
                        path={ path }
                        url={ url }
                        collection={ collection }
                        collectionRecordTypes={ collectionRecordTypes }
                    />
                )
                : (
                    <StudyRecordTypeView
                        customRecordTypes={ collectionRecordTypes }
                        collection={ collection }
                    />
                )
            )}
        </div>
    );
}

const RoutingForCustomTypes = ({
    path,
    url,
    collection,
    collectionRecordTypes
}) => {
    return (
        <Switch>
            <Route exact path={`${path}`}>
                <RedirectOrTypeNav
                    baseUrl={ url }
                    recordTypes={ collectionRecordTypes }
                />
            </Route>
            <Route path={`${path}/:recordType`}>
                <StudyRecordTypeView
                    customRecordTypes={ collectionRecordTypes }
                    collection={ collection }
                />
            </Route>
        </Switch>
    )
}

export default GenericCollectionView;
