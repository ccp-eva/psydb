import React, { useEffect, useState } from 'react';

import {
    Route,
    Switch,
    useHistory
} from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Icons
} from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import ErrorBoundary from './error-boundary';
import ServerTimezoneContext from '@mpieva/psydb-ui-lib/src/server-timezone-context';

import SideNav from './side-nav';
import TopFunctions from './top-functions';

import CustomRecordTypes from './custom-record-types';
import Studies from './studies';
import StudyTopics from './study-topics';
import Locations from './locations';
import Subjects from './subjects';
import Personnel from './personnel';
import ResearchGroups from './research-groups';
import SystemRoles from './system-roles';
import ExternalPersons from './external-persons';
import ExternalOrganizations from './external-organizations';
import HelperSets from './helper-sets';

import Calendars from './calendars';
import LabOperation from './lab-operation';
import Experiments from './experiments';

import AwayTeamCalendar from './calendars/away-team-experiments/calendar';

const Main = ({ onSignedOut, onSignedIn }) => {
    var history = useHistory();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchServerTimezone()
    ), [])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var serverTimezone = fetched.data.timezone;
    //console.log({ serverTimezone });

    var onSignOut = () => (
        agent.signOut()
        .then(
            (res) => {
                //console.log('logged out');
                onSignedOut();
                history.push('/');
            },
            (error) => {
                //console.log('error on logout');
            }
        )
    );

    return (
        <ServerTimezoneContext.Provider value={ serverTimezone }>
            <Switch>
                { /*<Route
                    path='/calendars/away-team/:locationType/:researchGroupId'
                    component={ withEB(AwayTeamCalendar) }
                />*/}
                <Route>
                    <LayoutedRoutes { ...({ onSignOut }) }/>
                </Route>
            </Switch>
        </ServerTimezoneContext.Provider>
    )
}

const LayoutedRoutes = ({ onSignOut }) => {
    return (
        <div className='enable-flexbox flex-core flex-row'>
            <header className='flex-core flex-row-reverse' style={{
                //alignItems: 'flex-end',
            }}>
                <div className='flex-core media-print-hidden' style={{
                    //width: '275px'
                    width: '225px'

                }}>
                    <SideNav />
                </div>
            </header>
            <main className='flex-core flex-grow mr-3' style={{
                //alignItems: 'flex-start',
            }}>
                <div className='pl-3' style={{
                    //width: '990px' // => min size: 1280
                    //width: '1076px' // => min size: 1366
                    //width: '1040px' // => min size: 1280
                }}>
                    <TopFunctions onSignOut={ onSignOut } />
                    <div>
                        <Routing />
                    </div>
                </div>
            </main>
        </div>
    );
}

var withEB = (Component) => (ps) => (
    <ErrorBoundary>
        <Component { ...ps } />
    </ErrorBoundary>
);

var Routing = () => (
    <>
    <Route path='/custom-record-types' component={ withEB(CustomRecordTypes) } />
    <Route path='/studies' component={ withEB(Studies) } />
    <Route path='/study-topics' component={ withEB(StudyTopics) } />
    <Route path='/locations' component={ withEB(Locations) } />
    <Route path='/subjects' component={ withEB(Subjects) } />
    <Route path='/personnel' component={ withEB(Personnel) } />
    <Route path='/research-groups' component={ withEB(ResearchGroups) } />
    <Route path='/system-roles' component={ withEB(SystemRoles) } />
    <Route path='/external-persons' component={ withEB(ExternalPersons) } />
    <Route path='/external-organizations' component={ withEB(ExternalOrganizations) } />
    <Route path='/helper-sets' component={ withEB(HelperSets) } />

    <Route path='/calendars' component={ withEB(Calendars) } />
    <Route path='/lab-operation' component={ withEB(LabOperation) } />
    <Route path='/experiments' component={ withEB(Experiments) } />
    </>
)

export default Main;
