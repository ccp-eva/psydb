import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import Reservation from './reservation';

const LabOperation = () => {
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

    var studyTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'study'
        ))
    );

    return (
        <div>
            <header>
                <h1 style={{ borderBottom: '1px solid lightgrey' }}>
                    Studienbetrieb
                </h1>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    {( 
                        studyTypes.length === 1
                        ? (
                            <Redirect to={ `${url}/${studyTypes[0].type}` }/>
                        )
                        : ( 
                            <>
                                <h2>Studientypen</h2>
                                <RecordTypeNav items={ studyTypes } />
                            </>
                        )
                    )}
                </Route>
                <Route exact path={`${path}/:studyType`}>
                    <BigNav items={[
                        { 
                            label: 'Reservierung',
                            linkTo: '/reservation'
                        },
                        { 
                            label: 'Probandenauswahl',
                            linkTo: '/subject-selection'
                        },
                        {
                            label: 'Terminbestätigung',
                            linkTo: '/experiment-confirmation'
                        },
                        {
                            label: 'Nachbereitung',
                            linkTo: '/experiment-postprocessing'
                        },
                    ]} />
                </Route>
                <Route path={`${path}/:studyType/reservation`}>
                    <>
                        <h2>Reservierung</h2>
                        <Reservation />
                    </>
                </Route>
                <Route path={`${path}/:studyType/subject-selection`}>
                    <div>
                        <div>have tabs for inhouse/away</div>
                        <div>select studies (multiple)</div>
                        <div>select subject type</div>
                        <div>select age-windows</div>
                    </div>
                </Route>
            </Switch>
        </div>

    )
}

export default LabOperation;
