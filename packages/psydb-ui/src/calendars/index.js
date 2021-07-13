import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    LinkContainer
} from 'react-router-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import up from '@mpieva/psydb-ui-lib/src/url-up';
import BigNav from '@mpieva/psydb-ui-lib/src/big-nav';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import InhouseExperimentsRouting from './inhouse-experiments';
import AwayTeamExperimentsRouting from './away-team-experiments';

const Calendars = () => {
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

    var subjectTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'subject'
        ))
    );

    var locationTypes = (
        metadata.customRecordTypes.filter(it => (
            it.collection ===  'location'
        ))
    );

    return (
        <div>
            <header>
                <LinkContainer to={ url }>
                    <h1 className='mb-0 border-bottom' role='button'>
                        Kalender
                    </h1>
                </LinkContainer>
            </header>
            <Switch>
                <Route exact path={`${path}`}>
                    <CalendarNav />
                </Route>
                <Route path={ `${path}/inhouse` }>
                    <InhouseExperimentsRouting
                        subjectRecordTypes={ subjectTypes }
                    />
                </Route>
                <Route path={ `${path}/away-team` }>
                    <AwayTeamExperimentsRouting
                        locationTypes={ locationTypes }
                    />
                </Route>
            </Switch>
        </div>

    )
}

const RedirectOrTypeNav = ({
    baseUrl,
    studyTypes,
    title,
}) => {
    if (studyTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${studyTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ studyTypes } />
            </>
        )
    }
}

const CalendarNav = () => {
    var { path, url } = useRouteMatch();
    
    //var baseUrl = up(url, 1);

    return (
        <BigNav items={[
            { 
                label: 'Rezeption',
                linkUrl: `${url}/reception`,
            },
            { 
                label: 'Inhouse Termine',
                linkUrl: `${url}/inhouse`,
            },
            {
                label: 'Externe Termine',
                linkUrl: `${url}/away-team`,
            },
        ]} />
    );
}

export default Calendars;
