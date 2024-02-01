// TODO: currently unused
import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import RedirectOrTypeNav from '../redirect-or-type-nav';

const CollectionNav = (ps) => {
    var {
        collection,
        collectionRecordTypes,
        baseUrl,
        enableRedirect
    } = ps;

    if (!collectionRecordTypes) {
        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.readCustomRecordTypeMetadata()
        ), [ collection ]);

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
        <RedirectOrTypeNav
            baseUrl={ url }
            recordTypes={ collectionRecordTypes }
            enableRedirect={ enableRedirect }
        />
    )
}

export default CollectionNav;
