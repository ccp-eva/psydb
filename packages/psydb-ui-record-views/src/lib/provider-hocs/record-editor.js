import React, { useContext } from 'react';
import RecordEditor from '../providers/record-editor';

const withRecordEditor = (options = {}) => {
    var {
        Body,
        collection,
        subChannels,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
    } = options;

    var staticBag = {
        collection,
        subChannels,
        shouldFetchSchema,
        shouldFetchCRTSettings,
    }

    var Composed = (ps) => {
        var {
            recordType,
            id,
            revision,
            onSuccessfulUpdate,
            onFailedUpdate,
            ...pass
        } = ps;
        
        var editorBag = {
            collection,
            subChannels,
            recordType,
            id,
            revision,
            
            shouldFetchSchema,
            shouldFetchCRTSettings,

            onSuccessfulUpdate,
            onFailedUpdate,
        };

        return (
            <Provider { ...editorBag }>
                <WrappedBody { ...pass } />
            </Provider>
        )
    };

    var WrappedBody = (ps) => (
        <Body { ...useContext(RecordEditor.Context) } { ...ps } />
    );

    var Provider = (ps) => (
        <RecordEditor { ...staticBag } { ...ps } />
    )

    Composed.Body = Body;
    Composed.Context = RecordEditor.Context;
    Composed.Provider = Provider;

    return Composed;
}

export default withRecordEditor;
