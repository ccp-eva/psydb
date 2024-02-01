import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import * as enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import PermissionDenied from './permission-denied';
import withRecordTypeView from './with-record-type-view';


const withCollectionView = (options) => {
    var {
        collection: staticCollection,
        RecordList,
        RecordDetails,
        RecordCreator,
        RecordEditor,
        RecordRemover,
    } = options;

    var RecordTypeView = withRecordTypeView({
        shouldFetchCollectionTypes: false,

        RecordList,
        RecordDetails,
        RecordCreator,
        RecordEditor,
        RecordRemover,
    });

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

        var pageWrapperBag = {
            showTitle,
            title,
            titleLinkUrl: url
        };

        if (!canRead) {
            return <PermissionDenied { ...pageWrapperBag } />
        }
        
        // TODO: static types
        // FIXME: noSpacer still needed?
        // FIXME: we maybe want to have level 2 headline in record list
        return (
            <PageWrappers.Level1 { ...pageWrapperBag }>
                <div className='mt-3'>
                    <RecordTypeView { ...({
                        collection,
                        noSpacer: true
                    }) } />
                </div>
            </PageWrappers.Level1>
        );

    }
}

export default withCollectionView;
