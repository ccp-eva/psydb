import React from 'react';
import { useParams } from 'react-router-dom';
import { PermissionDenied, LoadingIndicator, NotFound }
    from '@mpieva/psydb-ui-layout';
import { useRevision, usePermissions, useFetch }
    from '@mpieva/psydb-ui-hooks';


export const withFetchOne = (options) => {
    var { Body, access, agentFN, paramKeys } = options;

    var WithFetchOne_Wrapper = (ps) => {
        var params = useParams();
        var revision = useRevision();
        var permissions = usePermissions();
        
        var isAccessGranted = false;
        var isAccessGranted = checkAccess({ access, permissions });
        if (!isAccessGranted) {
            return <PermissionDenied />
        }
        
        var payload = {};
        for (var it of paramKeys) {
            payload[it] = ps[it] || params[it]
        }

        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.fetch(agentFN, {
                ...payload,
                extraAxiosConfig: { disableErrorModal: 404 }
            })
        ), [ revision.value ]);
        
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
        
        var bag = { ...ps, fetched, revision, permissions };
        return (
            <Body { ...bag } />
        )
    }

    return WithFetchOne_Wrapper;
}

const checkAccess = (bag) => {
    var { access, permissions } = bag;

    var OK = false;
    for (var it of access) {
        if (OK === true) {
            continue;
        }
        if (typeof it === 'object') {
            OK = permissions.hasCollectionFlag(it.collection, it.level);
        }
        else {
            OK = permissions.hasFlag(it);
        }
    }

    return OK;
}
