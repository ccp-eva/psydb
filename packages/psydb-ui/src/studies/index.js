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

import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import StudyRecordTypeView from './record-type-view';

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
}) => {
    var collection = 'study';


    var { path, url } = useRouteMatch();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ metadata, setMetadata ] = useState();

    useEffect(() => {
        agent.readCustomRecordTypeMetadata().then(
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
                <LinkContainer to={ url }>
                    <h1 className='m-0 border-bottom' role='button'>
                        { collectionDisplayNames[collection] || collection }
                    </h1>
                </LinkContainer>
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
                    <StudyRecordTypeView
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
                <RecordTypeNav
                    items={ collectionRecordTypes }
                />
            </Route>
            <Route path={`${path}/:recordType`}>
                <StudyRecordTypeView
                    customRecordTypes={ collectionRecordTypes }
                    collection={ collection }
                />
            </Route>
        </Switch>
    )
}

export default GenericCollectionView;
