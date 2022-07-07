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

    var Composed = (ps) => {
        var {
            recordType,
            id,
            onSuccessfulUpdate,
            onFailedUpdate,
            ...pass
        } = ps;
        
        var editorBag = {
            collection,
            subChannels,
            recordType,
            id,
            
            shouldFetchSchema,
            shouldFetchCRTSettings,

            onSuccessfulUpdate,
            onFailedUpdate,
        };

        return (
            <RecordEditor { ...editorBag }>
                <Inner { ...pass } />
            </RecordEditor>
        )
    };

    var Inner = (ps) => (
        <Body { ...useContext(RecordEditor.Context) } { ...ps } />
    );

    Composed.Body = Body;
    return Composed;
}

export default withRecordEditor;
