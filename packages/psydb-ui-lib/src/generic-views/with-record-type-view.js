import React from 'react';

import {
    Route,
    Redirect,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    PageWrappers,
    Alert
} from '@mpieva/psydb-ui-layout';

import GenericRecordListContainer from '../record-list-container';
import RecordTypeRouting from './record-type-routing';

const DefaultRecordDetails = (ps) => (
    <Alert variant='danger'>
        <b>ERROR: RecordDetails component not set</b>
    </Alert>
)

const DefaultRecordHistory = (ps) => (
    <Alert variant='danger'>
        <b>ERROR: RecordHistory component not set</b>
    </Alert>
)

const DefaultRecordEditor = (ps) => (
    <Alert variant='danger'>
        <b>ERROR: RecordEditor component not set</b>
    </Alert>
)

const DefaultRecordCreator = (ps) => (
    <Alert variant='danger'>
        <b>ERROR: RecordCreator component not set</b>
    </Alert>
)


const withRecordTypeView = (options) => {
    var {
        RecordList = GenericRecordListContainer,
        RecordDetails,
        RecordHistory = DefaultRecordHistory,
        RecordCreator = DefaultRecordCreator,
        RecordEditor = DefaultRecordEditor,
        RecordRemover,

        CustomRouting,
        shouldFetchCollectionTypes = false,
    } = options;

    // NOTE: allow omission of record details if only editor present
    RecordDetails = RecordDetails || RecordEditor;

    const Routing = CustomRouting || RecordTypeRouting;

    const RecordTypeView = (ps) => {
        var {
            collection,
            collectionRecordTypes,
            noSpacer
        } = ps;

        collectionRecordTypes = collectionRecordTypes || [];

        var [ language ] = useUILanguage();
        var translate = useUITranslation();
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
        var title = undefined;

        if (recordType) {
            typeData = collectionRecordTypes.find(it => (
                (it.type === recordType)
                && it.collection === collection
            ));

            var { label, displayNameI18N = {} } = typeData.state;
            var displayName = displayNameI18N[language] || label;
            
            title = `${translate('Type')}: ${displayName}`;
        }

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
                    RecordHistory,
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
