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


const withRecordTypeView = ({
    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,

    shouldFetchCollectionTypes,
}) => {
    RecordList = RecordList || GenericRecordListContainer;
    RecordDetails = RecordDetails || GenericRecordDetailsContainer;
    RecordEditor = RecordEditor || GenericRecordFormContainer;
    RecordCreator = RecordCreator || GenericRecordFormContainer;

    const RecordTypeView = ({
        collection,
        collectionRecordTypes,
        noSpacer
    }) => {
        collectionRecordTypes = collectionRecordTypes || [];

        var { path, url } = useRouteMatch();
        var { recordType } = useParams();

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
            
                <Switch>
                    <Route exact path={`${path}`}>
                        <RecordList
                            linkBaseUrl={ url }
                            collection={ collection }
                            recordType={ recordType }
                            enableView={ true }
                            enableNew={ true }
                            enableEdit={ true }
                        />
                    </Route>

                    <Route exact path={`${path}/new`}>
                        <RecordCreator
                            type='create'
                            collection={ collection }
                            recordType={ recordType }
                            onSuccessfulUpdate={
                                ({ id }) => history.push(`${url}/${id}`)
                            }
                        />
                    </Route>

                    <Route
                        exact path={`${path}/:id`}
                        render={ (ps) => (
                            <Redirect to={
                                `${url}/${ps.match.params.id}/details`
                            } />
                        )}
                    />

                    <Route path={`${path}/:id/details`}>
                        <RecordDetails
                            collection={ collection }
                            recordType={ recordType }
                        />
                    </Route>

                    <Route path={`${path}/:id/edit`}>
                        <RecordEditor
                            type='edit'
                            collection={ collection }
                            recordType={ recordType }
                            onSuccessfulUpdate={ ({ id }) => {
                                history.push(`${url}/${id}`)
                            }}
                        />
                    </Route>

                </Switch>
            </div>
        );
    }

    return RecordTypeView
}

export default withRecordTypeView;
