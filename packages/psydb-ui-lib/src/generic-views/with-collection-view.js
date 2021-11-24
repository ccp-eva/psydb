import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

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

        var permissions = usePermissions();
        var canRead = permissions.hasCollectionFlag(collection, 'read');

        var { url } = useRouteMatch();
        var { hasCustomTypes } = allSchemaCreators[collection];

        if (!canRead) {
            return (
                <>
                    { showTitle && (
                        <CollectionHeader { ...({
                            url, collection
                        }) } />
                    )}
                    <div className='mt-3'>
                        <PermissionDenied />
                    </div>
                </>
            )
        }
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
