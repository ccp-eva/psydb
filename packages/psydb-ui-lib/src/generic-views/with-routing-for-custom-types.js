import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import useFetch from '../use-fetch';
import LoadingIndicator from '../loading-indicator';


const withRoutingForCustomTypes = ({
    RecordTypeView,
    shouldFetchCollectionTypes,
}) => {
    if (!RecordTypeView) {
        RecordTypeView = withRecordTypeView({
            shouldFetchCollectionTypes: false,
        });
    }

    return ({
        collection,
        collectionRecordTypes,
    }) => {
        var { path } = useRouteMatch();
    
        if (!shouldFetchCollectionTypes) {
             var [ didFetch, fetched ] = useFetch((agent) => (
                agent.readCustomRecordTypeMetadata()
            ));

            if (!didFetch) {
                return (
                    <LoadingIndicator size='lg' />
                )
            }

            collectionRecordTypes = (
                fetched.data.customRecordTypes.filter(it => (
                    it.collection ===  collection
                ))
            );
        }

        return (
            <Switch>
                <Route exact path={`${path}`}>
                    <RecordTypeNav
                        items={ collectionRecordTypes }
                    />
                </Route>
                <Route path={`${path}/:recordType`}>
                    <RecordTypeView { ...({
                        customRecordTypes: collectionRecordTypes,
                        collection
                    }) } />
                </Route>
            </Switch>
        )
    }
}

export default RoutingForCustomTypes;
