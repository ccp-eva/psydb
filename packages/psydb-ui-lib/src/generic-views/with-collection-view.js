import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import withRecordTypeView from './with-record-type-view';
import withRoutingForCustomTypes from './with-routing-for-custom-types';
import CollectionHeader from './collection-header';


const withCollectionView = ({
    collection: staticCollection,
    RoutingForCustomTypes,
    RecordTypeView
}) => {

    if (!RecordTypeView) {
        RecordTypeView = withRecordTypeView({
            shouldFetchCollectionTypes: true,
        });
    }

    if (!RoutingForCustomTypes) {
        RoutingForCustomTypes = withRoutingForCustomTypes({
            RecordTypeView,
            shouldFetchCollectionTypes: true
        })
    }

    return ({
        collection,
        showTitle = true,
        noSpacer
    }) => {
        collection = collection || staticCollection;

        var { url } = useRouteMatch();
        var { hasCustomTypes } = allSchemaCreators[collection];

        // TODO: static types
        return (
            <div>
                { showTitle && (
                    <CollectionHeader { ...({
                        url, collection
                    }) } />
                )}
                {(
                    hasCustomTypes
                    ? (
                        <RoutingForCustomTypes { ...({
                            collection,
                        }) } />
                    )
                    : (
                        <RecordTypeView { ...({
                            collection,
                            noSpacer,
                        }) } />
                    )
                )}
            </div>
        );

    }
}

export default withCollectionView;
