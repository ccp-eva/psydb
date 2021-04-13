import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    LinkContainer
} from 'react-router-bootstrap';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';
import RecordListContainer from './record-list-container';
import GenericRecordTypeView from './generic-record-type-view';

// TODO: put this somewhere
var collectionDisplayNames = {
    'location': 'Locations',
    'subject': 'Probanden',
    'study': 'Studien',
    'researchGroup': 'Forschungsgruppen',
    'personnel': 'Mitarbeiter',
    'systemRole': 'System-Rollen',
}

const GenericCollectionView = ({
    collection,
}) => {
    var { path, url } = useRouteMatch();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ metadata, setMetadata ] = useState();

    useEffect(() => {
        agent.get('/api/metadata/custom-record-types').then(
            (response) => {
                setMetadata(response.data.data);
                setIsInitialized(true)
            }
        )
    }, [])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    var { hasCustomTypes } = allSchemaCreators[collection];

    // only if hasCustomRecordTypes
    console.log(metadata);
    var collectionRecordTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  collection
        ))
    );


    // TODO: static types
    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    { collectionDisplayNames[collection] || collection }
                </h1>
            </header>
            {(
                hasCustomTypes
                ? (
                    <RoutingForCustomTypes
                        path={ path }
                        url={ url }
                        collection={ collection }
                        collectionRecordTypes={ collectionRecordTypes }
                    />
                )
                : (
                    <GenericRecordTypeView
                        customRecordTypes={ collectionRecordTypes }
                        collection={ collection }
                    />
                )
            )}
        </div>
    );
}

const RoutingForCustomTypes = ({
    path,
    url,
    collection,
    collectionRecordTypes
}) => {
    return (
        <Switch>
            <Route exact path={`${path}`}>
                <RecordTypeNavList
                    items={ collectionRecordTypes }
                    linkBaseUrl={ url }
                />
            </Route>
            <Route path={`${path}/:recordType`}>
                <GenericRecordTypeView
                    customRecordTypes={ collectionRecordTypes }
                    collection={ collection }
                />
            </Route>
        </Switch>
    )
}

const RecordTypeNavList = ({ items, linkBaseUrl }) => {
    return (
        <div>
            { items.map(it => (
                <h2 key={ it._id } style={{ border: '1px solid lightgrey'}}>
                    <LinkContainer to={`${linkBaseUrl}/${it.type}`}>
                        <a>{ it.state.label } {'->'}</a>
                    </LinkContainer>
                </h2>
            ))}
        </div>
    )
}


export default GenericCollectionView;
