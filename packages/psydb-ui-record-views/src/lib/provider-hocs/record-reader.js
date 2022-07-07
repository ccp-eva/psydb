import React from 'react';
import RecordReader from '../providers/record-reader';

const withRecordReader = (options = {}) => {
    var {
        Body,

        collection,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
    } = options;

    var Composed = (ps) => {
        var {
            recordType,
            id,
            ...pass
        } = ps;

        var readerBag = {
            collection,
            recordType,
            id,
            
            shouldFetchSchema,
            shouldFetchCRTSettings,
        };
        return (
            <RecordReader { ...readerBag }>
                <RecordReader.Context.Consumer>
                    {(context) => (
                        <Body
                            { ...context }
                            { ...pass }
                        />
                    )}
                </RecordReader.Context.Consumer>
            </RecordReader>
        )
    };

    Composed.Body = Body;
    return Composed;
}

export default withRecordReader;
