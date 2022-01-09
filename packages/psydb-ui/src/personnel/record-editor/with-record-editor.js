import React from 'react';
import { useParams } from 'react-router-dom';

import {
    PermissionDenied,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import {
    usePermissions,
    useFetch
} from '@mpieva/psydb-ui-hooks';

export const withRecordEditor = (options) => {
    var { EditForm } = options;

    var RecordEditor = (ps) => {
        var { collection, recordType } = ps;
        var { id } = useParams();

        var permissions = usePermissions();
        var canWrite = permissions.hasCollectionFlag(
            collection, 'write'
        );
        if (!canWrite) {
            return <PermissionDenied />
        }

        var [ didFetch, fetched ] = useFetch((agent) => {
            return agent.readRecord({ collection, recordType, id })
        }, [ collection, recordType, id ]);

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }

        return (
            <EditForm { ...ps } id={ id } fetched={ fetched } />
        )
    }

    return RecordEditor;
}
