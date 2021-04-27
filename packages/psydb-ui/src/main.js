import React, { useEffect, useState } from 'react';

import {
    HashRouter as Router,
    Route,
} from 'react-router-dom';

import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';

import SideNav from './side-nav';
import CustomRecordTypes from './custom-record-types';
import Locations from './locations';
import Subjects from './subjects';
import Personnel from './personnel';
import ResearchGroups from './research-groups';
import SystemRoles from './system-roles';
import LabOperation from './lab-operation';

const Main = ({ onSignedOut, onSignedIn }) => {
    var onSignOut = () => (
        agent.signOut()
        .then(
            (res) => {
                console.log('logged out');
                onSignedOut();
            },
            (error) => {
                console.log('error on logout');
            }
        )
    )
    return (
        <Router>
            <div className='enable-flexbox flex-core flex-row'>
                <header className='flex-core flex-grow flex-row-reverse' style={{
                    //alignItems: 'flex-end',
                }}>
                    <div className='flex-core' style={{
                        width: '275px'
                    }}>
                        <SideNav />
                    </div>
                </header>
                <main className='flex-core flex-grow' style={{
                    //alignItems: 'flex-start',
                }}>
                    <div style={{ width: '990px' }}>
                        <div className='flex-core flex-row-reverse'>
                            <div className='flex-core'>
                                <a onClick={ onSignOut }>Sign-Out</a>
                            </div>
                        </div>
                        <div className='p-3'>
                            <Routing />
                        </div>
                    </div>
                </main>
            </div>
        </Router>
    );
}

var Routing = () => (
    <>
    <Route path='/custom-record-types' component={ CustomRecordTypes } />
    <Route path='/locations' component={ Locations } />
    <Route path='/subjects' component={ Subjects } />
    <Route path='/personnel' component={ Personnel } />
    <Route path='/research-groups' component={ ResearchGroups } />
    <Route path='/system-roles' component={ SystemRoles } />

    <Route path='/lab-operation' component={ LabOperation } />
    </>
)

export default Main;
