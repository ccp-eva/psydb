import React, { useState, useEffect } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

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
    LinkContainer,
    PermissionDenied
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
    
    var permissions = usePermissions();
    
    var canViewReception = permissions.hasFlag(
        'canViewReceptionCalendar'
    );

    var canViewAny = (
        canViewReception ||
        permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canViewExperimentCalendar' ]
        })
    );

    if (!canViewAny) {
        return (
            <>
                <h1 className='mb-0 border-bottom' role='button'>
                    Kalender
                </h1>
                <div className='mt-3'>
                    <PermissionDenied />
                </div>
            </>
        )
    }

    var canViewInhouse = permissions.hasLabOperationFlag(
        'inhouse', 'canViewExperimentCalendar',
    );
    var canViewAwayTeam = permissions.hasLabOperationFlag(
        'away-team', 'canViewExperimentCalendar',
    );
    var canViewVideo = permissions.hasLabOperationFlag(
        'online-video-call', 'canViewExperimentCalendar',
    );

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


    var navItems = [
        (canViewReception && { 
            label: 'Rezeption',
            linkUrl: `${url}/reception`,
        }),
        (canViewInhouse && { 
            label: 'Interne Termine',
            linkUrl: `${url}/inhouse`,
        }),
        (canViewAwayTeam && {
            label: 'Externe Termine',
            linkUrl: `${url}/away-team`,
        }),
        (canViewVideo && {
            label: 'Video Termine',
            linkUrl: `${url}/online-video-call`,
        }),
    ].filter(it => !!it)

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
                    <BigNav items={ navItems } />
                </Route>
                { canViewReception && (
                    <Route path={ `${path}/reception` }>
                        <ReceptionCalendar />
                    </Route>
                )}
                { canViewInhouse && (
                    <Route path={ `${path}/inhouse` }>
                        <InhouseExperimentsRouting
                            subjectRecordTypes={ subjectTypes }
                        />
                    </Route>
                )}
                { canViewAwayTeam && (
                    <Route path={ `${path}/away-team` }>
                        <AwayTeamExperimentsRouting
                            locationTypes={ locationTypes }
                        />
                    </Route>
                )}
                { canViewVideo && (
                    <Route path={ `${path}/online-video-call` }>
                        <OnlineVideoCallExperimentsRouting
                            subjectRecordTypes={ subjectTypes }
                        />
                    </Route>
                )}
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

export default Calendars;
