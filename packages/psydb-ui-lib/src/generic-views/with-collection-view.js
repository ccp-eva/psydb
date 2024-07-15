import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import enums from '@mpieva/psydb-schema-enums';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    PermissionDenied,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import withRecordTypeView from './with-record-type-view';
import withRoutingForCustomTypes from './with-routing-for-custom-types';


const withCollectionView = (options) => {
    var {
        collection: staticCollection,
        RoutingForCustomTypes,
        RecordTypeView
    } = options;

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

    return (ps) => {
        var {
            collection = staticCollection,
            showTitle = true,
            noSpacer
        } = ps;

        var translate = useUITranslation();
        var title = translate(
            enums.collections.getLabel(collection) || collection
        );

        var permissions = usePermissions();
        var canRead = permissions.hasCollectionFlag(collection, 'read');

        var { url } = useRouteMatch();
        var { hasCustomTypes } = allSchemaCreators[collection];

        if (!canRead) {
            return (
                <PageWrappers.Level1
                    showTitle={ showTitle }
                    title={ title }
                    titleLinkUrl={ url }
                >
                    <div className='mt-3'>
                        <PermissionDenied />
                    </div>
                </PageWrappers.Level1>
            )
        }
        
        // TODO: static types
        // FIXME: noSpacer still needed?
        return (
            <PageWrappers.Level1
                showTitle={ showTitle }
                title={ title }
                titleLinkUrl={ url }
            >
                {(
                    hasCustomTypes
                    ? (
                        <RoutingForCustomTypes { ...({
                            collection,
                        }) } />
                    )
                    : (
                        <div className='mt-3'>
                            <RecordTypeView { ...({
                                collection,
                                noSpacer: true
                            }) } />
                        </div>
                    )
                )}
            </PageWrappers.Level1>
        );

    }
}

export default withCollectionView;
