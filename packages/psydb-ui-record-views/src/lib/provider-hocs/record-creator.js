import React from 'react';
import RecordCreator from '../providers/record-creator';

const withRecordCreator = (options = {}) => {
    var {
        Body,
        collection,
        shouldFetchCRTSettings = true,
    } = options;

    var Composed = (ps) => {
        var {
            recordType,
            onSuccessfulUpdate,
            onFailedUpdate,
            ...pass
        } = ps;

        var creatorBag = {
            collection,
            recordType,
            
            onSuccessfulUpdate,
            onFailedUpdate,

            shouldFetchCRTSettings,
        };

        return (
            <RecordCreator { ...creatorBag }>
                <RecordCreator.Context.Consumer>
                    {(context) => (
                        <Body { ...context } { ...pass } />
                    )}
                </RecordCreator.Context.Consumer>
            </RecordCreator>
        )
    };

    Composed.Body = Body;
    return Composed;
}

export default withRecordCreator;
