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
} from 'react-bootstrap';

import {
    DoorClosedFill
} from 'react-bootstrap-icons';

import agent from '@mpieva/psydb-ui-request-agents';

import ErrorBoundary from './error-boundary';

import SideNav from './side-nav';
import CustomRecordTypes from './custom-record-types';
import Studies from './studies';
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

const Main = ({ onSignedOut, onSignedIn }) => {
    var history = useHistory();

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
    )
    return (
        <div className='enable-flexbox flex-core flex-row'>
            <header className='flex-core flex-grow flex-row-reverse' style={{
                //alignItems: 'flex-end',
            }}>
                <div className='flex-core' style={{
                    //width: '275px'
                    width: '225px'

                }}>
                    <SideNav />
                </div>
            </header>
            <main className='flex-core flex-grow' style={{
                //alignItems: 'flex-start',
            }}>
                <div style={{
                    //width: '990px' // => min size: 1280
                    //width: '1076px' // => min size: 1366
                    width: '1040px' // => min size: 1280
                }}>
                    <div className='flex-core flex-row-reverse pt-2 pb-1'>
                        <div className='flex-core'>
                            <a
                                onClick={ onSignOut }
                            >
                                <DoorClosedFill className='align-middle' />
                                <u className='d-inline-block ml-2 align-middle'>
                                    Abmelden
                                </u>
                            </a>
                        </div>
                    </div>
                    <div className='pl-3'>
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
