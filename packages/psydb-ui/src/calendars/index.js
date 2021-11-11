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
    BigNav,
    LinkContainer
} from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import ReceptionCalendar from './reception';
import InhouseExperimentsRouting from './inhouse-experiments';
import AwayTeamExperimentsRouting from './away-team-experiments';
import OnlineVideoCallExperimentsRouting from './online-video-call-experiments';

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
                <Route path={ `${path}/reception` }>
                    <ReceptionCalendar />
                </Route>
                <Route path={ `${path}/inhouse` }>
                    <InhouseExperimentsRouting
                        subjectRecordTypes={ subjectTypes }
                    />
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
                <Route path={ `${path}/online-video-call` }>
                    <OnlineVideoCallExperimentsRouting
                        subjectRecordTypes={ subjectTypes }
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
                label: 'Interne Termine',
                linkUrl: `${url}/inhouse`,
            },
            {
                label: 'Externe Termine',
                linkUrl: `${url}/away-team`,
            },
            {
                label: 'Video Termine',
                linkUrl: `${url}/online-video-call`,
            },
        ]} />
    );
}

export default Calendars;
