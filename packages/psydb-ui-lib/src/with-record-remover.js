import React from 'react';

import {
    useRouteMatch,
    useParams,
    Switch,
    Route
} from 'react-router-dom';

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
        SuccessInfo
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
        var { id: paramId } = useParams();
        var id = manualId || paramId;

        var permissions = usePermissions();
        var canRemove = permissions.hasCollectionFlag(collection, 'remove');
        if (!canRemove) {
            return <PermissionDenied />
        }

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

    return RecordRemover;
}
