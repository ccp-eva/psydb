import React from 'react';
import { useParams } from 'react-router-dom';

import {
    PermissionDenied,
    LoadingIndicator,
    NotFound,
} from '@mpieva/psydb-ui-layout';

import {
    usePermissions,
    useReadRecord
} from '@mpieva/psydb-ui-hooks';

export const withRecordEditor = (options) => {
    var {
        EditForm,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
    } = options;

    var RecordEditor = (ps) => {
        var { collection, recordType, id: manualId } = ps;
        var { id: paramId } = useParams();
        var id = manualId || paramId;

        var permissions = usePermissions();
        var canWrite = permissions.hasCollectionFlag(
            collection, 'write'
        );
        if (!canWrite) {
            return <PermissionDenied />
        }

        var [ didFetch, fetched ] = useReadRecord({
            collection, recordType, id,
            shouldFetchSchema,
            shouldFetchCRTSettings,
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
            <EditForm { ...ps } id={ id } fetched={ fetched } />
        )
    }

    return RecordEditor;
}
