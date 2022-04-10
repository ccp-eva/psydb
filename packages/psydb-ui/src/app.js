import React, { useEffect, useState } from 'react';

import {
    HashRouter as Router,
} from 'react-router-dom';

import agent, { simple as publicAgent } from '@mpieva/psydb-ui-request-agents';

import {
    SelfContext,
    AgentContext
} from '@mpieva/psydb-ui-contexts';

import ErrorResponseModalSetup from './error-response-modal-setup';
import ErrorBoundary from './error-boundary';
import SignIn from './sign-in';
import Main from './main'

const App = () => {

    var [ isSignedIn, setIsSignedIn ] = useState(false);
    var [ self, setSelf ] = useState();
    var [ isInitialized, setIsInitialized ] = useState(false);

    var onSignedIn = (selfArg) => {
        setIsSignedIn(true);
        if (selfArg) {
            setSelf(selfArg);
        }
    }

    var onSignedOut = () => {
        setIsSignedIn(false);
    }

    useEffect(() => {
        setIsInitialized(false)
        publicAgent.get('/api/self').then(
            (res) => {
                var self = res.data.data;
                onSignedIn(self);
                setIsInitialized(true)
            },
            (error) => {
                setIsInitialized(true)
            }
        )
    }, [ isSignedIn ]);

    var View = undefined;
    if (isInitialized) {
        View = (
            isSignedIn && self
            ? (
                <AgentContext.Provider value={ agent }>
                    <ErrorResponseModalSetup />
                    <SelfContext.Provider value={{ ...self, setSelf }}>
                        <Main onSignedOut={ onSignedOut } />
                    </SelfContext.Provider>
                </AgentContext.Provider>
            )
            : (
                <AgentContext.Provider value={ publicAgent }>
                    <SignIn onSignedIn={ onSignedIn } />
                </AgentContext.Provider>
            )
        );
    }
    else {
        View = <AppInitializing />
    }

    return (
        <ErrorBoundary>
            <Router>
                { View }
            </Router>
        </ErrorBoundary>
    );
}

const AppInitializing = () => (
    <div>Loading</div>
)

export default App;
