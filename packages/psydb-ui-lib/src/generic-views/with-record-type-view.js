import React from 'react';

import {
    Route,
    Redirect,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, PageWrappers } from '@mpieva/psydb-ui-layout';

import GenericRecordListContainer from '../record-list-container';
import GenericRecordDetailsContainer from '../generic-record-details-container';
import GenericRecordFormContainer from '../generic-record-form-container';

import RecordTypeRouting from './record-type-routing';

const withRecordTypeView = ({
    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,
    RecordRemover,

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

        var title = (
            typeData
            ? `Typ: ${typeData.state.label}`
            : undefined
        );
        return (
            <PageWrappers.Level2
                showTitle={ !!title }
                title={ title }
                titleLinkUrl={ url }
            >
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
                    RecordRemover,
                }) } />
            </PageWrappers.Level2>
        );
    }

    return RecordTypeView
}

export default withRecordTypeView;
