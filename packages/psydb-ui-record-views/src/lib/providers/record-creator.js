import React from 'react';

import {
    LoadingIndicator,
    PermissionDenied,
} from '@mpieva/psydb-ui-layout';

import {
    useFetch,
    usePermissions,
    useSendCreate
} from '@mpieva/psydb-ui-hooks';

import { RecordCreatorContext } from '../contexts';


const RecordCreator = (ps) => {
    var {
        collection,
        recordType,

        onSuccessfulUpdate,
        onFailedUpdate,

        shouldFetchCRTSettings = true,
        
        children
    } = ps;

    var permissions = usePermissions();
    var canWrite = permissions.hasCollectionFlag(
        collection, 'write'
    );
    if (!canWrite) {
        return <PermissionDenied />
    }

    var send = useSendCreate({
        collection,
        recordType,
        onSuccessfulUpdate,
        onFailedUpdate,
    });

    var crtSettings = undefined;
    if (shouldFetchCRTSettings) {
        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.readCRTSettings({
                collection, recordType
            })
        ), [ collection, recordType ]);

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }

        crtSettings = fetched.data;
    }

    var context = {
        collection,
        recordType,
        permissions,
        
        crtSettings,
        send,
    };

    return (
        <RecordCreatorContext.Provider value={ context }>
            { children }
        </RecordCreatorContext.Provider>
    );
}

RecordCreator.Context = RecordCreatorContext;

export default RecordCreator;
