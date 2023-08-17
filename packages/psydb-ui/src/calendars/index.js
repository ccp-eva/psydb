import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useFetch } from '@mpieva/psydb-ui-hooks';

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
    PermissionDenied,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';

import ReceptionCalendar from './reception';
import InviteExperimentsRouting from './invite-experiments';
import AwayTeamExperimentsRouting from './away-team-experiments';

const Calendars = () => {
    var { path, url } = useRouteMatch();
   
    var translate = useUITranslation();
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
                    { translate('Calendars') }
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

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCustomRecordTypeMetadata()
    ), [])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var metadata = fetched.data;

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
            label: translate('Reception'),
            linkUrl: `${url}/reception`,
        }),
        (canViewInhouse && { 
            label: translate('Inhouse Appointments'),
            linkUrl: `${url}/inhouse`,
        }),
        (canViewAwayTeam && {
            label: translate('External Appointments'),
            linkUrl: `${url}/away-team`,
        }),
        (canViewVideo && {
            label: translate('Video Appointments'),
            linkUrl: `${url}/online-video-call`,
        }),
    ].filter(it => !!it)

    return (
        <div>
            <header>
                <LinkContainer to={ url }>
                    <h1 className='mb-0 border-bottom' role='button'>
                        { translate('Calendars') }
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
                        <InviteExperimentsRouting
                            inviteType='inhouse'
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
                        <InviteExperimentsRouting
                            inviteType='online-video-call'
                            subjectRecordTypes={ subjectTypes }
                        />
                    </Route>
                )}
            </Switch>
        </div>

    )
}

export default Calendars;
