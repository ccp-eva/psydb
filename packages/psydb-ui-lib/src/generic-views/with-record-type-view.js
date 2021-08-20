import React from 'react';

import {
    Route,
    Redirect,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import useFetch from '../use-fetch';
import LoadingIndicator from '../loading-indicator';

import GenericRecordListContainer from '../record-list-container';
import GenericRecordDetailsContainer from '../generic-record-details-container';
import GenericRecordFormContainer from '../generic-record-form-container';

import RecordTypeHeader from './record-type-header';
import RecordTypeRouting from './record-type-routing';

const withRecordTypeView = ({
    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,

    CustomRouting,
    shouldFetchCollectionTypes,
}) => {
    RecordList = RecordList || GenericRecordListContainer;
    RecordDetails = RecordDetails || GenericRecordDetailsContainer;
    RecordEditor = RecordEditor || GenericRecordFormContainer;
    RecordCreator = RecordCreator || GenericRecordFormContainer;

    const Routing = CustomRouting || RecordTypeRouting;

    const RecordTypeView = ({
        collection,
        collectionRecordTypes,
        noSpacer
    }) => {
        collectionRecordTypes = collectionRecordTypes || [];

        var { path, url } = useRouteMatch();
        var { recordType } = useParams();
        var history = useHistory();

        if (shouldFetchCollectionTypes) {
            var [ didFetch, fetched ] = useFetch((agent) => (
                agent.readCustomRecordTypeMetadata()
            ), [ collection ]);

            if (!didFetch) {
                return (
                    <LoadingIndicator size='lg' />
                )
            }

            collectionRecordTypes = (
                fetched.data.customRecordTypes.filter(it => (
                    it.collection ===  collection
                ))
            );
        }

        var typeData = undefined;
        if (recordType) {
            typeData = collectionRecordTypes.find(it => (
                (it.type === recordType)
                && it.collection === collection
            ));
        }

        return (
            <div>
                { recordType && (
                    <RecordTypeHeader { ...({
                        url,
                        label: typeData.state.label
                    })} />
                )}
                { (!recordType && !noSpacer) && (
                    <div className='mb-3'></div>
                )}
                
                <Routing { ...({
                    collection,
                    recordType,
                    
                    url,
                    path,
                    history,

                    RecordList,
                    RecordDetails,
                    RecordCreator,
                    RecordEditor,
                }) } />
            </div>
        );
    }

    return RecordTypeView
}

export default withRecordTypeView;
