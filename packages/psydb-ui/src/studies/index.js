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
    PermissionDenied,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import {
    RedirectOrTypeNav,
    RecordListContainer
} from '@mpieva/psydb-ui-lib';

import * as enums from '@mpieva/psydb-schema-enums';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import StudyRecordTypeView from './record-type-view';

const GenericCollectionView = () => {
    var collection = 'study';
    var title = enums.collections.getLabel(collection) || collection;
    var { hasCustomTypes } = allSchemaCreators[collection];

    var { path, url } = useRouteMatch();
    
    var permissions = usePermissions();
    var canRead = permissions.hasFlag('canReadStudies');
    if (!canRead) {
        return (
            <PageWrappers.Level1 title={ title } titleLinkUrl={ url }>
                <div className='mt-3'>
                    <PermissionDenied />
                </div>
            </PageWrappers.Level1>
        )
    }

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var collectionRecordTypes = fetched.data;

    // TODO: static types
    return (
        <PageWrappers.Level1 title={ title } titleLinkUrl={ url }>
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
        </PageWrappers.Level1>
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
