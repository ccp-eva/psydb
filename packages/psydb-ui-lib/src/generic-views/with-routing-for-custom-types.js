import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import RedirectOrTypeNav from '../redirect-or-type-nav';
import RecordTypeRedirector from './record-type-redirector';


const withRoutingForCustomTypes = (options) => {
    var {
        RecordTypeView,
        shouldFetchCollectionTypes,
        enableRedirect = true
    } = options;

    if (!RecordTypeView) {
        RecordTypeView = withRecordTypeView({
            shouldFetchCollectionTypes: false,
        });
    }

    return (ps) => {
        var {
            collection,
            collectionRecordTypes = []
        } = ps;

        var { url, path } = useRouteMatch();

        if (shouldFetchCollectionTypes) {
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
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ url }
                        recordTypes={ collectionRecordTypes }
                        enableRedirect={ enableRedirect }
                    />
                </Route>
                <Route exact path={ `${path}/:id([0-9a-f]{24})` }>
                    <RecordTypeRedirector collection={ collection} />
                </Route>
                <Route path={`${path}/:recordType`}>
                    <RecordTypeView { ...({
                        collection,
                        collectionRecordTypes,
                    }) } />
                </Route>
            </Switch>
        )
    }
}

export default withRoutingForCustomTypes;
