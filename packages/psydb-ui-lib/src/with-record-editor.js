import React from 'react';
import { useParams } from 'react-router-dom';

import { RecordEditorContext } from '@mpieva/psydb-ui-contexts';

import {
    PermissionDenied,
    LoadingIndicator,
    NotFound,
} from '@mpieva/psydb-ui-layout';

import {
    usePermissions,
    useReadRecord,
    useRevision,
} from '@mpieva/psydb-ui-hooks';

var isFunction = (it) => (typeof it === 'function');

export const withRecordEditor = (options) => {
    var {
        EditForm,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
    } = options;

    var RecordEditor = (ps) => {
        var { collection, recordType, id: manualId, revision, children } = ps;
        var { id: paramId } = useParams();
        var id = manualId || paramId;

        var internalRevision = useRevision();
        revision = revision || internalRevision;

        var permissions = usePermissions();
        var canWrite = permissions.hasCollectionFlag(
            collection, 'write'
        );
        if (!canWrite) {
            return <PermissionDenied />
        }

        var dependencies = (
            revision ? [ revision.value ] : []
        );

        var [ didFetch, fetched ] = useReadRecord({
            collection, recordType, id,
            shouldFetchSchema,
            shouldFetchCRTSettings,
            extraAxiosConfig: { disableErrorModal: 404 }
        }, dependencies);

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

        var context = {
            id, collection, recordType, fetched, permissions, revision
        };
        return (
            <>
                <EditForm { ...ps }
                    id={ id }
                    fetched={ fetched }
                    revision={ revision }
                />
                
                <RecordEditorContext.Provider value={ context }>
                    { isFunction(children) ? children() : children }
                </RecordEditorContext.Provider>
            </>
        )
    }

    return RecordEditor;
}
