import React, { useEffect, useState } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import agent from './public-agent';

const Main = ({ onSignedOut, onSignedIn }) => {
    var onSignOut = () => (
        agent.post('/api/sign-out')
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
            <div>
                <a onClick={ onSignOut }>Sign-Out</a>
                <Link to='/'>Slash</Link>
                <Link to='/nested'>Nested</Link>
                <Route path='/nested' component={Nested} />
            </div>
        </Router>
    );
}

const Nested = () => (
    <div>Nested</div>
)

export default Main;
