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

import agent from '@mpieva/psydb-ui-request-agents';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

const Locations = () => {
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

    // only if hasCustomRecordTypes
    console.log(metadata);
    var locationTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'location'
        ))
    );

    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    Locations
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <RecordTypeNavList
                        items={ locationTypes }
                        linkBaseUrl={ url }
                    />
                </Route>
                <Route path={`${path}/:recordType`}>
                    <RecordTypeView
                        customRecordTypes={ locationTypes }
                        collection='location'
                    />
                </Route>
            </Switch>
        </div>
    );
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

const RecordTypeView = ({
    customRecordTypes,
    collection,
}) => {
    var { path, url } = useRouteMatch();
    var { recordType } = useParams();

    var typeData = customRecordTypes.find(it => (
        it.type === recordType
        && it.collection === collection
    ));

    return (
        <div>
            <h2>{ typeData.state.label }</h2>
            <Switch>
                <Route exact path={`${path}`}>
                    <RecordListContainer
                        linkBaseUrl={ url }
                        collection={ collection }
                        recordType={ recordType }
                    />
                </Route>
            </Switch>
        </div>
    );
}

export default Locations;
