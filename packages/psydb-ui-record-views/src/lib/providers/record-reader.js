import React from 'react';
import { useParams } from 'react-router-dom';

import { RecordReaderContext } from '../contexts';

import {
    PermissionDenied,
    LoadingIndicator,
    NotFound,
} from '@mpieva/psydb-ui-layout';

import {
    usePermissions,
    useReadRecord
} from '@mpieva/psydb-ui-hooks';


const RecordReader = (ps) => {
    var {
        collection,
        recordType,
        id: manualId,
        revision,

        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
        
        children
    } = ps;

    var { id: paramId } = useParams();
    var id = manualId || paramId;

    var permissions = usePermissions();
    var canRead = permissions.hasCollectionFlag(
        collection, 'read'
    );
    if (!canRead) {
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
        id,
        collection,
        recordType,
        fetched,
        permissions
    };

    return (
        <RecordReaderContext.Provider value={ context }>
            { children }
        </RecordReaderContext.Provider>
    );
}

RecordReader.Context = RecordReaderContext;

export default RecordReader;
