import React, { useState } from 'react';

import {
    useRouteMatch,
    useParams,
    Switch,
    Route
} from 'react-router-dom';

import { demuxed } from '@mpieva/psydb-ui-utils';

import {
    NotFound,
    PermissionDenied,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import {
    usePermissions,
    useReadRecord
} from '@mpieva/psydb-ui-hooks';

export const withRecordRemover = (options) => {
    var {
        SafetyForm,
        SuccessInfo,
        urlIdParam = 'id',
        noRouting = false,
    } = options;

    var SafetyFormWrapper = (ps) => {
        var { collection, recordType, id } = ps;

        var [ didFetch, fetched ] = useReadRecord({
            collection, recordType, id,
            shouldFetchSchema: false,
            shouldFetchCRTSettings: false,
            extraAxiosConfig: { disableErrorModal: 404 }
        });
        
        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }

        var { didReject, errorResponse } = fetched;
        if (didReject) {
            var { status } = errorResponse;
            if (status === 404) {
                return <NotFound />
            }
        }

        return (
            <SafetyForm { ...ps } fetched={ fetched } />
        );
    }

    var SuccessInfoWrapper = (ps) => {
        return (
            <SuccessInfo { ...ps } />
        )
    }

    var RecordRemover = (ps) => {
        var { collection, recordType, id: manualId } = ps;
        var { path } = useRouteMatch();
        var params = useParams();
        var id = manualId || params[urlIdParam];

        var permissions = usePermissions();
        var canRemove = permissions.hasCollectionFlag(collection, 'remove');
        if (!canRemove) {
            return <PermissionDenied />
        }

        if (noRouting) {
            var [ isSuccessful, setIsSuccessful ] = useState(false);
            var { onSuccessfulUpdate, ...pass } = ps;
            return (
                !isSuccessful
                ? <SafetyFormWrapper
                    { ...pass }
                    id={ id }
                    onSuccessfulUpdate={ demuxed([
                        () => setIsSuccessful(true),
                        onSuccessfulUpdate
                    ])}
                />
                : <SuccessInfoWrapper { ...ps } id={ id } />
            )
        }
        else {
            return (
                <Switch>
                    <Route exact path={ `${path}`}>
                        <SafetyFormWrapper { ...ps } id={ id }/>
                    </Route>
                    <Route exact path={ `${path}/success` }>
                        <SuccessInfoWrapper { ...ps } id={ id } />
                    </Route>
                </Switch>
            )
        }
    }

    return RecordRemover;
}
