import React from 'react';
import { useParams } from 'react-router-dom';

import {
    PermissionDenied,
    LoadingIndicator,
    NotFound,
} from '@mpieva/psydb-ui-layout';

import {
    useRevision,
    usePermissions,
    useReadRecord
} from '@mpieva/psydb-ui-hooks';

export const withRecordDetails = (options) => {
    var {
        DetailsBody,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
    } = options;

    var RecordDetails = (ps) => {
        var {
            collection, recordType, id: manualId,
            
            fetched: props_fetched,
            revision: props_revision,
        } = ps;

        var { id: paramId } = useParams();
        var id = manualId || paramId;

        var revision = props_revision || useRevision();
        var permissions = usePermissions();
        var canRead = permissions.hasCollectionFlag(
            collection, 'read'
        );
        if (!canRead) {
            return <PermissionDenied />
        }

        // XXX
        if (props_fetched) {
            var fetched = props_fetched;
            return (
                <DetailsBody
                    { ...ps }
                    id={ id }
                    fetched={ fetched }
                    permissions={ permissions }
                    revision={ revision }
                />
            )
        }

        var [ didFetch, fetched ] = useReadRecord({
            collection, recordType, id,
            shouldFetchSchema,
            shouldFetchCRTSettings,
            extraAxiosConfig: { disableErrorModal: 404 }
        }, [ revision.value ]);

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
            <DetailsBody
                { ...ps }
                id={ id }
                fetched={ fetched }
                permissions={ permissions }
                revision={ revision }
            />
        )
    }

    return RecordDetails;
}
