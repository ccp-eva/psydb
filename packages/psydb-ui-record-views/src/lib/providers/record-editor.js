import React, { useContext } from 'react';
import { useSendPatch } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import { RecordEditorContext } from '../contexts';
import RecordReader from './record-reader';


const RecordEditor = (ps) => {
    var {
        collection,
        subChannels,
        recordType,
        id,
        onSuccessfulUpdate,
        onFailedUpdate,
        
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,

        children,
    } = ps;

    var readerBag = {
        collection,
        recordType,
        id,
        
        shouldFetchSchema,
        shouldFetchCRTSettings,
    };

    var innerBag = {
        subChannels,
        onSuccessfulUpdate,
        onFailedUpdate,
    }
    return (
        <RecordReader { ...readerBag }>
            <Inner { ...innerBag }>
                { children }
            </Inner>
        </RecordReader>
    );
}

const Inner = (ps) => {
    var readerContext = useContext(RecordReader.Context);

    var {
        subChannels,
        onSuccessfulUpdate,
        onFailedUpdate,
        children,
    } = ps;

    var {
        collection,
        recordType,
        id,
        fetched,
        permissions,
    } = readerContext;

    var canWrite = permissions.hasCollectionFlag(
        collection, 'write'
    );
    if (!canWrite) {
        return <PermissionDenied />
    }

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var send = useSendPatch({
        collection,
        recordType,
        record,
        subChannels,
        onSuccessfulUpdate,
        onFailedUpdate,
    });

    var context = {
        ...readerContext,
        send,
    };

    return (
        <RecordEditorContext.Provider value={ context }>
            { children }
        </RecordEditorContext.Provider>
    );
}

RecordEditor.Context = RecordEditorContext;

export default RecordEditor;
