import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

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
    RecordListContainer,
    FormBox,
} from '@mpieva/psydb-ui-lib';

import * as enums from '@mpieva/psydb-schema-enums';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import StudyRecordContainer from './record-container';
import StudyRecordForm from './record-form';

const StudyRouting = (ps) => {
    var {
        collection,
        recordType,

        url,
        path,
        history,

        RecordList,
    } = ps;

    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    return (
        <Switch>
            <Route exact path={ path }>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
                    enableView={ true }
                    enableNew={ true }
                    enableEdit={ true }
                />
            </Route>
            <Route exact path={`${path}/new`}>
                { canWrite
                    ? (
                        <FormBox title='Neuer Datensatz'>
                            <StudyRecordForm
                                type='create'
                                recordType={ recordType }
                                onSuccessfulUpdate={
                                    ({ id }) => history.push(`${url}/${id}/selection-settings`)
                                }
                            />
                        </FormBox>
                    )
                    : <PermissionDenied />
                }
            </Route>
            <Route path={`${path}/:id`}>
                <StudyRecordContainer
                    collection={ collection }
                    recordType={ recordType }
                />
            </Route>
        </Switch>
    )
}

const StudyTypeView = withRecordTypeView({
    CustomRouting: StudyRouting
});

const Studies = withCollectionView({
    collection: 'study',
    //RecordTypeView: StudyRecordTypeView,
    RecordTypeView: StudyTypeView
});

export default Studies;

//const GenericCollectionView = () => {
//    var collection = 'study';
//    var title = enums.collections.getLabel(collection) || collection;
//    var { hasCustomTypes } = allSchemaCreators[collection];
//
//    var { path, url } = useRouteMatch();
//    
//    var permissions = usePermissions();
//    var canRead = permissions.hasFlag('canReadStudies');
//    if (!canRead) {
//        return (
//            <PageWrappers.Level1 title={ title } titleLinkUrl={ url }>
//                <div className='mt-3'>
//                    <PermissionDenied />
//                </div>
//            </PageWrappers.Level1>
//        )
//    }
//
//    var [ didFetch, fetched ] = useFetch((agent) => (
//        agent.fetchCollectionCRTs({ collection })
//    ), []);
//
//    if (!didFetch) {
//        return <LoadingIndicator size='lg' />
//    }
//
//    var collectionRecordTypes = fetched.data;
//
//    // TODO: static types
//    return (
//        <PageWrappers.Level1 title={ title } titleLinkUrl={ url }>
//            {(
//                hasCustomTypes
//                ? (
//                    <RoutingForCustomTypes
//                        path={ path }
//                        url={ url }
//                        collection={ collection }
//                        collectionRecordTypes={ collectionRecordTypes }
//                    />
//                )
//                : (
//                    <StudyRecordTypeView
//                        customRecordTypes={ collectionRecordTypes }
//                        collection={ collection }
//                    />
//                )
//            )}
//        </PageWrappers.Level1>
//    );
//}
//
//const RoutingForCustomTypes = ({
//    path,
//    url,
//    collection,
//    collectionRecordTypes
//}) => {
//    return (
//        <Switch>
//            <Route exact path={`${path}`}>
//                <RedirectOrTypeNav
//                    baseUrl={ url }
//                    recordTypes={ collectionRecordTypes }
//                />
//            </Route>
//            <Route path={`${path}/:recordType`}>
//                <StudyRecordTypeView
//                    customRecordTypes={ collectionRecordTypes }
//                    collection={ collection }
//                />
//            </Route>
//        </Switch>
//    )
//}
//
//export default GenericCollectionView;
